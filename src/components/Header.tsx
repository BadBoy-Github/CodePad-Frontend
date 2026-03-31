import { FaPlay } from "react-icons/fa";

// React icons
import { CgBulb } from "react-icons/cg";
import { TbBulbFilled } from "react-icons/tb";

interface HeaderProps {
  onRun: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

const Header = ({ onRun, language, onLanguageChange }: HeaderProps) => {
  return (
    <div className=" w-full h-20 flex items-center justify-between">
      <div className="bg-teal-200 h-full flex items-center justify-between p-4 rounded-xl">
        <div className="w-14 h-14 bg-teal-100 rounded-full flex justify-center items-center">
          <img src="/logo.png" alt="CodePad" className="p-1" />
        </div>
        <div className="ml-6 flex flex-col items-start">
          <h1 className=" font-bold text-teal-600 text-2xl">CodePad</h1>
          <p className="text-teal-800 text-sm">code like pro</p>
        </div>
      </div>
      <div className="bg-teal-200 h-full rounded-xl flex items-center justify-center px-4 gap-2">
        {/* Theme toggle */}
        <div className="h-10 w-10 bg-teal-500 mr-5 rounded-xl flex justify-center items-center p-2">
          <TbBulbFilled className="text-amber-300" size={30}/>
        </div>
        {/* Language Toggle Buttons */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onLanguageChange("javascript")}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              language === "javascript"
                ? "bg-teal-500 text-white"
                : "bg-teal-100 text-teal-700 hover:bg-teal-200"
            }`}
          >
            JS
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange("python")}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              language === "python"
                ? "bg-teal-500 text-white"
                : "bg-teal-100 text-teal-700 hover:bg-teal-200"
            }`}
          >
            PY
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange("java")}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              language === "java"
                ? "bg-teal-500 text-white"
                : "bg-teal-100 text-teal-700 hover:bg-teal-200"
            }`}
          >
            JV
          </button>
        </div>
        {/* Run Button */}
        <button
          type="button"
          onClick={onRun}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium flex items-center gap-2 cursor-pointer"
        >
          <FaPlay className="text-sm" />
          <span>Run</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
