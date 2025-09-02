import profileImg from "@/assets/images/profileImage.png";
import { logoutUser } from "../../../../features/auth/store/authSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ProfileInfo = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser()); 
    // Optionally redirect user after logout
    window.location.href = "/"; 
    // or use navigate("/login") if using react-router
  };
  return (
    <Link 
      to="/profile"
      className="flex flex-col items-center text-darkblue hover:scale-105 transition cursor-pointer"
      onClick={handleLogout}
    >
      <div className="relative w-10 h-10 rounded-full border border-black/40 flex items-center justify-center overflow-hidden bg-white">
        <img
          src={profileImg}
          alt="profile"
          className="w-6 h-6 object-cover group-hover:scale-110 transition"
        />
      </div>
      <span className="text-base font-medium">    {t('mobileNavigation.profile')}</span>
    </Link>
  );
};

export default ProfileInfo;
