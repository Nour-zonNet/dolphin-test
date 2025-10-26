import React, { useEffect, useState } from "react";
import logo from "@/assets/logo/dolphinLogo.png";
import { useLessons } from "../hooks/useLessons";
import { useParams } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import MyPhone from "../../../components/ui/PhoneInput/PhoneInput";
import dolphinIcon from "@/assets/images/homeChild.png";
const GlobalSessionPage = () => {
  const { username } = useParams();
  // = useParams()
  const { getGlobalSessionByTeacherUsername, joinGlobalSession } = useLessons();
  const { user } = useAuth();
  const [globalSession, setGlobalSession] = useState(null);
  useEffect(() => {
    const getGlobalSession = async () => {
      const res = await getGlobalSessionByTeacherUsername(username).unwrap();
      setGlobalSession(res);
    };

    
    getGlobalSession();
  }, [getGlobalSessionByTeacherUsername, username]);

  const handlePhoneChange = (phone) => {
    setGlobalSession((prev) => ({ ...(prev || {}), phone_number: phone }));
  };

  const handleJoinGlobalSession = async () => {
    const res = await joinGlobalSession({
      phone_number: user?.phoneNumber || globalSession?.phone_number,
      teacher_id: globalSession?.teacher_id,
      class_session_id: globalSession?.id,
    }).unwrap();
    if (res?.url) {
      window.location.href = res.url;
    }
  };
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4 "
    >
      <div className="bg-white rounded-2xl  w-full max-w-md ">
        {/* Header */}
        <div className="  relative p-6 text-white text-center">
          <img src={logo} alt="logo" className=" mx-auto h-15" />
          <div className="absolute top-0 z-20 left-0 flex items-center justify-center">
            <img
              src={dolphinIcon}
              alt="teacher"
              className="w-28 rounded-full transform -scale-x-100"
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6 border rounded-xl border-gray-200 relative">
          
          {/* Teacher Name */}
          {user?.name && (
            <div className="space-y-2">
              <label className="block  text-[#E89B32] font-bold">
                اسم الطالب:
              </label>
              <div className="bg-[#DDE8EE] rounded-2xl p-3  text-navyteal  border-gray-200">
                {user?.name}
              </div>
            </div>
          )}
          {globalSession?.teacher_name && (
            <div className="space-y-2">
              <label className="block  text-[#E89B32] font-bold">
                اسم المعلم:
              </label>
              <div className="bg-[#DDE8EE] rounded-2xl p-3  text-navyteal  border-gray-200">
                {globalSession?.teacher_name}
              </div>
            </div>
          )}
          {globalSession?.class_name && (
            <div className="space-y-2">
              <label className="block  text-[#E89B32] font-bold">
                الصف الدراسي
              </label>
              <div className="bg-[#DDE8EE] rounded-2xl p-3  text-navyteal  border-gray-200">
                {globalSession?.class_name?.[0]}
              </div>
            </div>
          )}

          {globalSession?.session_name && (
            <div className="space-y-2">
              <label className="block  text-[#E89B32] font-bold">الدرس:</label>
              <div className="bg-[#DDE8EE] rounded-2xl p-3  text-navyteal  border-gray-200">
                {globalSession?.session_name}
              </div>
            </div>
          )}

          {globalSession?.group_name && (
            <div className="space-y-2">
              <label className="block  text-[#E89B32] font-bold">
                المجموعة:
              </label>
              <div className="bg-[#DDE8EE] rounded-2xl p-3  text-navyteal  border-gray-200">
                {globalSession?.group_name}
              </div>
            </div>
          )}

          <div className="space-y-4 border-[#00477C] rounded-2xl p-4 border-1 border-dashed">
            <div className="space-y-2">
              <label className="block  text-[#E89B32] font-bold">
                رقم الجوال
              </label>
              <MyPhone
                value={user?.phoneNumber || globalSession?.phone_number}
                onChange={handlePhoneChange}
                disabled={!!user}
                readOnly={!!user}
              />
            </div>

            <button
              onClick={handleJoinGlobalSession}
              disabled={
                !globalSession?.teacher_id ||
                (!user?.phoneNumber && !globalSession?.phone_number) ||
                !globalSession?.id
              }
              className={`w-full py-3 rounded-full font-bold transition-all duration-300 shadow-md ${
                !globalSession?.teacher_id ||
                (!user?.phoneNumber && !globalSession?.phone_number) ||
                !globalSession?.id
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r text-navyteal bg-orangedeep hover:shadow-lg"
              }`}
            >
              دخول الحصة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSessionPage;
