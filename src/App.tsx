import Footer from "./components/Footer";
import Header from "./components/Header";
import MainBody from "./components/MainBody";
import { useState } from "react";

const App = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [code, setCode] = useState<string>("//Start writing your code here...");
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);

  const handleRun = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      // Capture console.log output
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args: unknown[]) => {
        logs.push(
          args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg),
            )
            .join(" "),
        );
      };

      // Execute the code
      const result = eval(code);

      // Restore console.log
      console.log = originalLog;

      // Build output string
      let output = logs.join("\n");
      if (result !== undefined) {
        output += (output ? "\n" : "") + `=> ${String(result)}`;
      }

      setConsoleOutput(output || "Code executed successfully (no output)");
    } catch (error) {
      setConsoleOutput(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    setIsTerminalOpen(true);
  };

  return (
    <div className=" px-10 pt-10 bg-teal-100 w-full h-screen flex flex-col">
      <Header onRun={handleRun} />
      <MainBody code={code} setCode={setCode} />
      <Footer
        isTerminalOpen={isTerminalOpen}
        setIsTerminalOpen={setIsTerminalOpen}
        consoleOutput={consoleOutput}
      />
    </div>
  );
};

export default App;
