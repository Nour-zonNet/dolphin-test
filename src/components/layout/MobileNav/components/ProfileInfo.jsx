import profileImg from "@/assets/images/profileImage.png";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ProfileInfo = () => {
  const { t } = useTranslation();

  return (
    <Link
      className="flex flex-col items-center text-darkblue hover:scale-105 transition cursor-pointer"
      to={"/profile"}
    >
      <div className="relative w-8 h-8 rounded-full border border-black/40 flex items-center justify-center overflow-hidden bg-white">
        <img
          src={profileImg}
          alt="profile"
          className="w-6 h-6 object-cover group-hover:scale-110 transition"
        />
      </div>
      <span className="text-base font-medium">{t('mobileNavigation.profile')}</span>
    </Link>
  );
};

export default ProfileInfo;
