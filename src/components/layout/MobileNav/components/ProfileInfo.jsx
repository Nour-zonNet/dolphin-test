import profileImg from "@/assets/images/profileImage.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

const ProfileInfo = ({ isActive = false }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Link
      to="/profile"
      aria-label={t("mobileNavigation.profile")}
      className="flex flex-col items-center justify-end hover:scale-105 transition cursor-pointer"
    >
      <div
        style={{ borderColor: isActive ? "#1B648E" : " #7a8085 " }}
        className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full   border-[0.1px] overflow-hidden bg-white"
      >
        <img
          src={user?.profilePicture || profileImg}
          alt={user?.name || "Profile"}
          className={`w-full h-full object-${ user?.profilePicture ? "cover" :"contain"} transition group-hover:scale-110`}
        />
      </div>

      <span
        className={`text-xs sm:text-xs font-semibold ${
          isActive ? "text-[#1B648E]" : "text-[#7A8085]"
        }`}
      >
        {t("mobileNavigation.profile")}
      </span>
    </Link>
  );
};

export default ProfileInfo;
