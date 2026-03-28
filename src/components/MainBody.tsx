import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";

interface MainBodyProps {
  code: string;
  setCode: (value: string) => void;
  isTerminalOpen: boolean;
  consoleOutput: string | null;
  isError: boolean;
  language: string;
  onTerminalInput?: (input: string, fullLine: string) => void;
  showTerminalInput?: boolean;
  javaProcessId?: number | null;
}

const MainBody = ({
  code,
  setCode,
  isTerminalOpen,
  consoleOutput,
  isError,
  language,
  onTerminalInput,
  showTerminalInput = false,
  javaProcessId,
}: MainBodyProps) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleEditorDidMount = (_editor: unknown, monaco: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const monacoEditor = monaco as any;
    // Define custom theme
    monacoEditor.editor.defineTheme("myCustomTheme", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "009689", fontStyle: "italic" },
        { token: "keyword", foreground: "ff0000", fontStyle: "bold" },
      ],
      colors: {
        "editor.background": "#96f7e4",
        "editor.lineHighlightBackground": "#ffffff50",
        "editor.lineHighlightBorder": "#009688",
      },
    });

    // Apply theme
    monacoEditor.editor.setTheme("myCustomTheme");
  };

  // Auto-scroll terminal to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  // Focus input when showTerminalInput becomes true
  useEffect(() => {
    if (showTerminalInput && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showTerminalInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && onTerminalInput) {
      onTerminalInput(inputValue, inputValue);
      setInputValue("");
    }
  };

  // Display console output as-is
  const displayOutput = () => {
    if (!consoleOutput) return "";
    return consoleOutput;
  };

  return (
    <div className="bg-teal-200 w-full h-[calc(100vh-200px)] my-5 rounded-xl overflow-hidden flex flex-col relative">
      {/* Terminal Window - overlays on top of editor */}
      <div
        className={`absolute left-0 right-0 bottom-0 z-10 h-40 bg-teal-900 border-t border-gray-700 transition-all duration-300 ease-in-out flex flex-col ${
          isTerminalOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-3 py-1 bg-teal-800 border-b border-gray-700">
          <span
            className={`text-sm font-semibold ${isError ? "text-red-400" : "text-amber-400"}`}
          >
            {isError ? "Error Output" : "Terminal Output"}
          </span>
          {showTerminalInput && javaProcessId && (
            <span className="text-xs text-green-400">Running</span>
          )}
        </div>

        {/* Terminal Output */}
        <div
          ref={terminalRef}
          className="flex-1 p-3 overflow-auto font-mono text-sm"
        >
          <pre className="whitespace-pre-wrap text-white">
            {displayOutput()}
          </pre>
        </div>

        {/* Input Field - Only show when Java is running and waiting for input */}
        {showTerminalInput && (
          <form
            onSubmit={handleSubmit}
            className="flex items-center border-t border-gray-700 bg-teal-800 px-3 py-2 font-mono text-sm"
          >
            <span className="text-green-400 mr-2">{">"}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your data here"
              className="flex-1 bg-transparent text-white outline-none placeholder-gray-400"
              autoFocus
            />
          </form>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
          className="py-2"
        />
      </div>
    </div>
  );
};

export default MainBody;
