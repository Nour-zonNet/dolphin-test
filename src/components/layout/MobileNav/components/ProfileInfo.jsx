import profileImg from "@/assets/images/profileImage.png";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ProfileInfo = () => {
  const { t } = useTranslation();

  return (
    <Link
      className="flex flex-col items-center justify-between text-darkblue hover:scale-105 transition cursor-pointer space-y-2"
      to={"/profile"}
    >
      <div className="relative rounded-full border border-bordercolor/40 flex items-center justify-center overflow-hidden bg-white">
        <img
          src={profileImg}
          alt="profile"
          className="w-6 h-6 object-cover group-hover:scale-110 transition"
        />
      </div>
      <span className="text-xs text-[#7A8085] sm:text-xs font-semibold">
        {t('mobileNavigation.profile')}</span>
    </Link>
  );
};

export default ProfileInfo;
