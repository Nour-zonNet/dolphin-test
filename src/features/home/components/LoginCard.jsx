import { Lock } from "@/utils/icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Book } from "../../../utils/Illustrations";
import { Square } from "../../../utils/icons";

const LoginCard = () => {
  const { t } = useTranslation();

  return (
    // Login Card
    <div className="w-full md:min-w-md md:max-w-xl lg:min-w-xl relative border-2 border-dashed border-[#0C78B9] rounded-full px-4 xs:px-6 py-4 mt-8 flex flex-row items-center justify-center">
      <Book className="absolute h-8 bottom-10 right-8" />

      <div className="flex flex-col items-center text-nowrap text-center">
        <h2 className="text-sm xs:text-lg md:text-[32px] lg:text-[40px] font-bold text-subtext">
          {t("home.loginToPlatform")}
        </h2>
        <p className="text-subtext mt-1 text-[12px] xs:text-[14px] md:text-[20px] lg:text-[24px]">
          {t("home.forNewAndExistingUsers")}
        </p>
        <Link
          to="/login"
          className="mt-4 flex items-center justify-center gap-2 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked cursor-pointer text-[#0C2D40] px-4 xs:px-6 py-2 rounded-full text-sm xs:text-base"
        >
          <Lock size={18} />
          {t("home.loginNow")}
        </Link>
      </div>

      <div className="absolute top-10 left-8">
        <Square className=" w-10" />
      </div>
    </div>
  );
};

export default LoginCard;
