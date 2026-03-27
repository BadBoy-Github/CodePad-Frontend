import Footer from "./components/Footer";
import Header from "./components/Header";
import MainBody from "./components/MainBody";
import { useState } from "react";

const App = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [code, setCode] = useState<string>("//Start writing your code here...");
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

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
      setIsError(false);
    } catch (error) {
      let errorMessage = "Unknown error";

      if (error instanceof Error) {
        errorMessage = error.message;
        // Try to extract line number from stack trace
        if (error.stack) {
          const stackLines = error.stack.split("\n");
          for (const line of stackLines) {
            // Look for patterns like "at <function> (file:line:col)" or "file:line:col"
            const match = line.match(
              /(?:at\s+(?:.*\s+)?)?(?:eval\s+)?[<(]?(?:.*\.js:?)(\d+):?(\d+)?/,
            );
            if (match) {
              const lineNum = match[1];
              // Adjust for the code starting line (line 1 is the default value, actual code starts after)
              const adjustedLine = parseInt(lineNum) - 1;
              errorMessage += ` (at line ~${adjustedLine})`;
              break;
            }
          }
        }
      } else {
        errorMessage = String(error);
      }

      setConsoleOutput(`Error: ${errorMessage}`);
      setIsError(true);
    }
    setIsTerminalOpen(true);
  };

  return (
    <div className=" px-10 pt-10 bg-teal-100 w-full h-screen flex flex-col">
      <Header onRun={handleRun} />
      <MainBody
        code={code}
        setCode={setCode}
        isTerminalOpen={isTerminalOpen}
        consoleOutput={consoleOutput}
        isError={isError}
      />
      <div className="h-10">
        <Footer
          isTerminalOpen={isTerminalOpen}
          setIsTerminalOpen={setIsTerminalOpen}
          isError={isError}
        />
      </div>
    </div>
  );
};

export default App;
