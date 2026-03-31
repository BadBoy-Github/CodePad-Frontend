import { FaPlay } from "react-icons/fa";

interface FooterProps {
  isTerminalOpen: boolean;
  setIsTerminalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isError: boolean;
  darkMode: boolean;
}

const Footer = ({
  isTerminalOpen,
  setIsTerminalOpen,
  isError,
  darkMode,
}: FooterProps) => {
  return (
    <div
      className={`w-full flex flex-col overflow-hidden rounded-t-xl h-10 ${darkMode ? "bg-gradient-to-r from-zinc-800 to-zinc-700" : "bg-gradient-to-r from-teal-200 to-teal-100"}`}
    >
      {/* Console Status Bar - always visible */}
      <div
        className={`h-10 flex items-center justify-between px-4 ${darkMode ? "bg-gradient-to-r from-zinc-900 to-zinc-800" : "bg-gradient-to-r from-teal-800 to-teal-700"}`}
      >
        <div
          className={`flex items-center gap-2 text-sm ${isError ? "text-red-400" : "text-amber-400"}`}
        >
          <FaPlay className="text-xs" />
          <span>{isError ? "Error" : "Ready"}</span>
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
