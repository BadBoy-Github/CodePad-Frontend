import Editor from "@monaco-editor/react";

interface MainBodyProps {
  code: string;
  setCode: (value: string) => void;
  isTerminalOpen: boolean;
  consoleOutput: string | null;
  isError: boolean;
}

const MainBody = ({
  code,
  setCode,
  isTerminalOpen,
  consoleOutput,
  isError,
}: MainBodyProps) => {
  const handleEditorDidMount = (_editor: unknown, monaco: any) => {
    // Define custom theme
    monaco.editor.defineTheme("myCustomTheme", {
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
    monaco.editor.setTheme("myCustomTheme");
  };

  return (
    <div className="bg-teal-200 w-full h-[calc(100vh-200px)] my-5 rounded-xl overflow-hidden flex flex-col relative">
      {/* Terminal Window - overlays on top of editor */}
      {isTerminalOpen && (
        <div className="absolute left-0 right-0 bottom-0 z-10 h-40 bg-teal-800 text-white p-4 overflow-auto border-t border-gray-700">
          <h3
            className={`font-semibold mb-2 ${isError ? "text-red-400" : "text-amber-400"}`}
          >
            {isError ? "Error Output" : "Terminal Output"}
          </h3>
          <pre className="text-sm font-mono">
            {`${consoleOutput || "No output"}`}
          </pre>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="//Start writing your code here..."
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
