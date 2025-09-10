import { Lock } from "@/utils/icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Book } from "../../../utils/Illustrations";
import { Square } from "../../../utils/icons";

const LoginCard = () => {
  const { t } = useTranslation();

  return (
    // Login Card
    <div className="w-full max-w-90 md:min-w-md md:max-w-xl lg:min-w-2xl relative border-2 border-dashed border-[#0C78B9] rounded-full px-4 xs:px-6 py-4 mt-8 flex flex-row items-center justify-center xl:mt-4">
      <Book className="absolute h-8 md:h-10 bottom-12 right-8 md:right-15" />

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

      <div className="absolute top-10 left-8 md:left-12 md:top-13">
        <Square className=" w-9 md:w-11" />
      </div>
    </div>
  );
};

export default LoginCard;
