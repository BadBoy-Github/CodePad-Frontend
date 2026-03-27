import { FaPlay } from "react-icons/fa";

interface FooterProps {
  isTerminalOpen: boolean;
  setIsTerminalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  consoleOutput: string | null;
}

const Footer = ({
  isTerminalOpen,
  setIsTerminalOpen,
  consoleOutput,
}: FooterProps) => {
  return (
    <div className="w-full bg-teal-200 flex flex-col overflow-hidden rounded-t-xl">
      {/* Terminal Window - appears when up arrow is clicked, grows upwards */}
      {isTerminalOpen && (
        <div className="h-40 bg-gray-900 text-white p-4 overflow-auto border-b border-gray-700">
          <h3 className="font-semibold mb-2 text-green-400">Terminal Output</h3>
          <pre className="text-sm font-mono">
            {`> Running code...
${consoleOutput || "No output"}`}
          </pre>
        </div>
      )}

      {/* Console Status Bar - always visible at bottom */}
      <div className="h-10 bg-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <FaPlay className="text-xs" />
          <span>Terminal Ready</span>
        </div>
        <button
          onClick={() => setIsTerminalOpen(!isTerminalOpen)}
          className="text-white hover:text-teal-300 transition-colors"
          aria-label={isTerminalOpen ? "Close terminal" : "Open terminal"}
        >
          {isTerminalOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Footer;
