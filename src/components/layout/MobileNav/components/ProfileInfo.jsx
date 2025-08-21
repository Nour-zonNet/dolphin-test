import profileImg from "@/assets/images/profileImage.png";

const ProfileInfo = () => {
  return (
    <button className="flex flex-col items-center text-darkblue hover:scale-105 transition">
      <div className="relative w-10 h-10 rounded-full border-1 border-black/40 flex items-center justify-center overflow-hidden bg-white">
        <img
          src={profileImg}
          alt="profile"
          className="w-6 h-6 object-cover group-hover:scale-110 transition"
        />
      </div>
      <span className="text-base font-medium">حسابي</span>
    </button>
  );
};

export default ProfileInfo;
