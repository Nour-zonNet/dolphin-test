import { Lock } from "@/utils/icons";
import { Plus } from "@/utils/Illustrations";
import { Link } from "react-router-dom";

const LoginCard = () => {
  return (
    <div className="border-2 border-dashed border-[#0C78B9] z-10 rounded-full px-6 py-6 mt-8 flex flex-row items-center w-full justify-around">
      <div className="pt-10">
        <Plus />
      </div>

      <div className="flex flex-col items-center text-nowrap">
        <h2 className="text-lg font-semibold text-[#0C2D40]">
          سجل دخول للمنصة
        </h2>
        <p className="text-gray-500 text-sm mt-1">للمستخدمين الجدد والحاليين</p>
        <Link to="/login" className="mt-4 flex items-center gap-2 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked cursor-pointer text-[#0C2D40] px-6 py-2 rounded-full">
          <Lock size={18} />
          سجل الآن
        </Link>
      </div>

      <div className="pb-10">
        <Plus />
      </div>
    </div>
  );
};

export default LoginCard;
