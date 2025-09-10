import profileImg from "@/assets/images/profileImage.png";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ProfileInfo = ({ isActive = false, onActivate }) => {
  const { t } = useTranslation();

  return (
    <Link
      className="flex flex-col items-center justify-end   hover:scale-105 transition cursor-pointer "
      to={"/profile"}
      onClick={onActivate}
    >
      <div className="relative w-8 h-8 rounded-full border border-bordercolor/40  overflow-hidden bg-white">
        <img
          src={profileImg}
          alt="profile"
          className="w-8 h-8 object-contain text-center group-hover:scale-110 transition"
        />
      </div>
      <span
        className="text-xs sm:text-xs font-semibold"
        style={{ color: isActive ? "#1B648E" : "#7A8085" }}
      >
        {t('mobileNavigation.profile')}
      </span>
    </Link>
  );
};

export default ProfileInfo;
