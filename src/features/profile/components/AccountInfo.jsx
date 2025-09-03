import React, { useEffect, useState } from 'react'
import { ProfileCard } from '@/components';
import { ProfileInputs } from '@/components';
import { ProfileButtons } from '@/components';
import flag from "@/assets/authentication/flag.svg";
import ChangeGradeModal from '@/components/profile/modal/ChangeGradeModal';

const AccountInfo = ({ user }) => {
  const [name, setName] = useState("يوستينا صلاح");
  const [phone, setPhone] = useState("09954321890");
  const [grade, setGrade] = useState("الصف الأول ابتدائي");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phoneNumber || "");
      setGrade(user.gradeName || "");
    }
  }, [user]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleSave = () => {
    console.log("Saving Changes: ", { name, phone, grade });
  }

  return (
    <>
    <ProfileCard className="p-8">
      <div className="flex flex-col items-center gap-8 h-full">
        <div className="text-center">
          <h3 className="font-bold text-navyteal text-xl md:text-2xl mb-2">
            بيانات الحساب
          </h3>
          <img
            className="w-[159.56px] h-[27.38px] mx-auto"
            alt="Decoration"
            src="https://c.animaapp.com/mf29nm7vjLRxgE/img/vector-2.svg"
          />
        </div>

        <div className="w-full max-w-6xl space-y-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 w-full">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-lg text-navyteall lg:ms-10">
                   الاسم
                </label>
              </div>
              <ProfileInputs 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-[#3c3c4399] border-[0.5px]"
              />
            </div>
            
            <div className="space-y-4 w-full relative">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-lg text-navyteall lg:ms-10">
                  رقم الجوال
                </label>
                <span className="text-[#676565] text-base">
                  ( غير قابل للتعديل )
                </span>
              </div>
              <ProfileInputs 
                value={phone}
                disabled
                className="border-[#aaaaaa] border-[0.5px]"
              />
              {/* <div className="absolute top-15 right-4"><img src={flag} alt="flag" /></div> */}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2 flex flex-col lg:flex-row lg:items-center justify-between">
              <label className="font-semibold text-lg text-navyteal lg:ms-10">
                الصف الدراسي الحالي
              </label>
              <p className="text-[#676565] text-base">
                ( يمكنك تغيير صفك الدراسي إذا كنت قد انتقلت إلي صف أعلي )
              </p>
            </div>
            
            <div className="relative">
              <div className="w-full h-[90px] rounded-[100px] border-[0.5px] border-solid border-[#7a8085] flex items-center justify-between px-8">
                
                <span className="text-[#5d6062] text-lg font-medium">
                  {grade}
                </span>
                <ProfileButtons variant="outline" size="sm" className="w-[210px] cursor-pointer" onClick={() => setIsModalOpen(true)}>
                  <img
                    className="w-4 md:w-6"
                    alt="Change"
                    src="https://c.animaapp.com/mf29nm7vjLRxgE/img/bold.svg"
                    />
                    <span className="text-navyteal text-base font-semibold">تغيير الصف</span>
                </ProfileButtons>
              </div>
            </div>
          </div>
        </div>

        <ProfileButtons variant="primary" size="md" className="my-8 w-full max-w-6xl cursor-pointer bg-orangedeep hover:bg-btnClicked" onClick={handleSave}>
          <img
            className="w-6 md:w-8"
            alt="Save"
            src="https://c.animaapp.com/mf29nm7vjLRxgE/img/layer-1.svg"
          />
          <span className="text-navyteal text-lg md:text-xl font-semibold">حفظ التغييرات</span>
        </ProfileButtons>
      </div>
    </ProfileCard>
      <ChangeGradeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
    </>
  );
};

export default AccountInfo