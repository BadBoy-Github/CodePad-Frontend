import { FaPlay } from "react-icons/fa";

interface HeaderProps {
  onRun: () => void;
}

const Header = ({ onRun }: HeaderProps) => {
  return (
    <div className=" w-full h-20 flex items-center justify-between">
      <div className="bg-teal-200 h-full flex items-center justify-between px-4 rounded-xl">
        <div className="w-14 h-14 bg-teal-100 rounded-full flex justify-center items-center">
          <img src="/logo.png" alt="CodePad" className="p-1" />
        </div>
        <div className="ml-6 flex flex-col items-start">
          <h1 className=" font-bold text-teal-600 text-2xl">CodePad</h1>
          <p className="text-teal-800 text-sm">code like pro</p>
        </div>
      </div>
      <div className="bg-teal-200 w-40 h-full rounded-xl flex items-center justify-center px-4">
        <button
          type="button"
          onClick={onRun}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
        >
          <FaPlay className="text-sm" />
          <span>Run</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
