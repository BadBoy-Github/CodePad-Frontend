import Footer from "./components/Footer";
import Header from "./components/Header";
import MainBody from "./components/MainBody";
import { useState, useEffect } from "react";

// Type definitions for Pyodide
interface PyodideInterface {
  runPython: (code: string) => unknown;
  loadPackagesFromCode: (code: string) => void;
  setStdout: (options: { batched: (msg: string) => void }) => void;
  setStderr: (options: { batched: (msg: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}
const App = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [code, setCode] = useState<string>("");
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [language, setLanguage] = useState<string>("javascript");
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [javaProcessId, setJavaProcessId] = useState<number | null>(null);
  const [javaRunning, setJavaRunning] = useState(false);
  const [javaRequiresInput, setJavaRequiresInput] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize Pyodide on component mount
  useEffect(() => {
    const initPyodide = async () => {
      if (!window.loadPyodide) {
        // Load Pyodide script dynamically
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js";
        script.async = true;
        script.onload = async () => {
          try {
            const py = await window.loadPyodide({
              indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/",
            });
            setPyodide(py);
          } catch (err) {
            console.error("Failed to load Pyodide:", err);
          }
        };
        document.body.appendChild(script);
      }
    };
    initPyodide();
  }, []);

  // Load saved code from session storage on mount and language change
  useEffect(() => {
    if (isInitialized) {
      const savedCode = sessionStorage.getItem(`code_${language}`);
      if (savedCode !== null) {
        setCode(savedCode);
      } else {
        setCode("");
      }
    }
  }, [language, isInitialized]);

  // Initialize state from session storage on mount
  useEffect(() => {
    const savedLanguage = sessionStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      setLanguage(savedLanguage);
      const savedCode = sessionStorage.getItem(`code_${savedLanguage}`);
      if (savedCode) {
        setCode(savedCode);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save code to session storage when it changes
  useEffect(() => {
    if (isInitialized && code !== undefined) {
      sessionStorage.setItem(`code_${language}`, code);
    }
  }, [code, language, isInitialized]);

  const handleLanguageChange = (newLanguage: string) => {
    // Save current language
    sessionStorage.setItem("selectedLanguage", newLanguage);
    setLanguage(newLanguage);

    // Load saved code for the new language from session storage
    const savedCode = sessionStorage.getItem(`code_${newLanguage}`);
    if (savedCode !== null) {
      setCode(savedCode);
    } else {
      setCode("");
    }

    setConsoleOutput(null);
    setIsError(false);
    setIsTerminalOpen(false);
  };

  // Handle Python code execution using Pyodide
  const handlePythonRun = async () => {
    if (!pyodide) {
      setConsoleOutput(
        "Loading Python runtime... Please wait a moment and try again.",
      );
      setIsError(true);
      setIsTerminalOpen(true);
      return;
    }

    try {
      // Capture stdout
      const logs: string[] = [];
      pyodide.setStdout({
        batched: (msg: string) => {
          logs.push(msg);
        },
      });

      pyodide.setStderr({
        batched: (msg: string) => {
          logs.push(`Error: ${msg}`);
        },
      });

      // Run the Python code
      const result = pyodide.runPython(code);

      // Build output
      let output = logs.join("\n");
      if (result !== undefined && result !== null) {
        output += (output ? "\n" : "") + `=> ${String(result)}`;
      }

      setConsoleOutput(output || "Code executed successfully (no output)");
      setIsError(false);
    } catch (error) {
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }
      setConsoleOutput(`Error: ${errorMessage}`);
      setIsError(true);
    }
    setIsTerminalOpen(true);
  };

  const handleRun = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Handle Java - send to backend server for compilation and execution
    const handleJavaRun = async () => {
      try {
        setConsoleOutput("Compiling and running Java code...\n");
        setIsTerminalOpen(true);
        setIsError(false);
        setJavaRunning(true);

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/execute/java/start`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          },
        );

        const result = await response.json();

        if (result.success) {
          setJavaProcessId(result.processId);
          // Show Java's output directly
          setConsoleOutput(result.output);
          setIsError(false);
          // Check if the program is waiting for input
          setJavaRequiresInput(result.requiresInput === true);

          // Check if already finished
          if (result.isFinished) {
            setJavaRunning(false);
            setJavaRequiresInput(false);
          }
        } else {
          setConsoleOutput(result.error || "Execution failed");
          setIsError(true);
          setJavaRunning(false);
        }
      } catch (error) {
        let errorMessage = "Failed to connect to backend server";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        setConsoleOutput(
          `Error: ${errorMessage}\n\nMake sure the backend server is running on ${import.meta.env.VITE_BACKEND_URL}`,
        );
        setIsError(true);
        setJavaRunning(false);
      }
      setIsTerminalOpen(true);
    };

    // Handle Java - use backend server
    if (language === "java") {
      handleJavaRun();
      return;
    }

    // Handle Python - use Pyodide (browser-based Python)
    if (language === "python") {
      handlePythonRun();
      return;
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

  // Handle terminal input for interactive Java programs
  const handleTerminalInput = async (input: string) => {
    if (!javaProcessId || !javaRunning) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/execute/java/input`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ processId: javaProcessId, input }),
        },
      );

      const result = await response.json();

      if (result.success) {
        // Use Java's output directly - it already includes user input
        setConsoleOutput(
          result.output + (result.isFinished ? "\n\nProgram finished." : ""),
        );

        console.log("Frontend - Input result:", {
          requiresInput: result.requiresInput,
          isFinished: result.isFinished,
          outputLength: result.output.length,
        });

        // Update requiresInput based on backend response
        setJavaRequiresInput(result.requiresInput === true);

        if (result.isFinished) {
          setJavaRunning(false);
          setJavaRequiresInput(false);
          setJavaProcessId(null);
        }
      } else {
        setConsoleOutput(
          (prev) => prev + "\nError: " + (result.error || "Input failed"),
        );
        setIsError(true);
        setJavaRunning(false);
        setJavaProcessId(null);
      }
    } catch (error) {
      console.error("Failed to send input:", error);
      setConsoleOutput((prev) => prev + "\nError: Failed to send input");
      setIsError(true);
    }
  };

  return (
    <div
      className={`px-10 pt-10 w-full h-screen flex flex-col ${darkMode ? "bg-zinc-900" : "bg-teal-100"}`}
    >
      <Header
        onRun={handleRun}
        language={language}
        onLanguageChange={handleLanguageChange}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <MainBody
        code={code}
        setCode={setCode}
        isTerminalOpen={isTerminalOpen}
        consoleOutput={consoleOutput}
        isError={isError}
        language={language}
        onTerminalInput={handleTerminalInput}
        showTerminalInput={javaRequiresInput}
        javaProcessId={javaProcessId}
        darkMode={darkMode}
      />
      <div className="h-10">
        <Footer
          isTerminalOpen={isTerminalOpen}
          setIsTerminalOpen={setIsTerminalOpen}
          isError={isError}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default App;
