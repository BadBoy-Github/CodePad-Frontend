import { FaPlay } from "react-icons/fa";

// React icons
import { CgBulb } from "react-icons/cg";
import { TbBulbFilled } from "react-icons/tb";

interface HeaderProps {
  onRun: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({
  onRun,
  language,
  onLanguageChange,
  darkMode,
  setDarkMode,
}: HeaderProps) => {
  return (
    <div className=" w-full h-20 flex items-center justify-between">
      <div
        className={`h-full flex items-center justify-between p-4 rounded-xl ${darkMode ? "bg-zinc-800" : "bg-teal-200"}`}
      >
        <div
          className={`w-14 h-14 rounded-full flex justify-center items-center ${darkMode ? "bg-zinc-700" : "bg-teal-100"}`}
        >
          <img src="/logo.png" alt="CodePad" className="p-1" />
        </div>
        <div className="ml-6 flex flex-col items-start">
          <h1
            className={`font-bold text-2xl ${darkMode ? "text-zinc-200" : "text-teal-600"}`}
          >
            CodePad
          </h1>
          <p
            className={`text-sm ${darkMode ? "text-zinc-400" : "text-teal-800"}`}
          >
            code like pro
          </p>
        </div>
      </div>
      <div
        className={`h-full rounded-xl flex items-center justify-center px-4 gap-2 ${darkMode ? "bg-zinc-800" : "bg-teal-200"}`}
      >
        {/* Theme toggle */}
        <div
          className={`h-10 w-10 mr-5 rounded-xl flex justify-center items-center p-2 cursor-pointer transition-colors ${darkMode ? "bg-amber-600 hover:bg-amber-700" : "bg-teal-500 hover:bg-teal-600"}`}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? (
            <CgBulb className="text-zinc-200" size={30} />
          ) : (
            <TbBulbFilled className="text-amber-300" size={30} />
          )}
        </div>
        {/* Language Toggle Buttons */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onLanguageChange("javascript")}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              language === "javascript"
                ? `${darkMode ? "bg-amber-500" : "bg-teal-500"} text-white`
                : `${darkMode ? "bg-zinc-700 text-zinc-300" : "bg-teal-100 text-teal-700"} hover:${darkMode ? "bg-zinc-600" : "bg-teal-200"}`
            }`}
          >
            JS
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange("python")}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              language === "python"
                ? `${darkMode ? "bg-amber-500" : "bg-teal-500"} text-white`
                : `${darkMode ? "bg-zinc-700 text-zinc-300" : "bg-teal-100 text-teal-700"} hover:${darkMode ? "bg-zinc-600" : "bg-teal-200"}`
            }`}
          >
            PY
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange("java")}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              language === "java"
                ? `${darkMode ? "bg-amber-500" : "bg-teal-500"} text-white`
                : `${darkMode ? "bg-zinc-700 text-zinc-300" : "bg-teal-100 text-teal-700"} hover:${darkMode ? "bg-zinc-600" : "bg-teal-200"}`
            }`}
          >
            JV
          </button>
        </div>
        {/* Run Button */}
        <button
          type="button"
          onClick={onRun}
          className={`px-4 py-2 rounded-lg hover:opacity-90 transition-colors font-medium flex items-center gap-2 cursor-pointer ${
            darkMode
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-teal-500 text-white hover:bg-teal-600"
          }`}
        >
          <FaPlay className="text-sm" />
          <span>Run</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
