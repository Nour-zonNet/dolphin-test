import  { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ProfileCard } from '@/components';
import { ProfileInputs } from '@/components';
import { ProfileButtons } from '@/components';
import { updateUserGrade } from '@/features/profile/store/profileSlice';
import flag from "@/assets/authentication/flag.svg";
import ChangeGradeModal from '@/components/profile/modal/ChangeGradeModal';

const AccountInfo = ({ user }) => {
  const dispatch = useDispatch(); 
  const [name, setName] = useState("يوستينا صلاح");
  const [phone, setPhone] = useState("09954321890");
  const [grade, setGrade] = useState(user?.gradeName || "");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmGrade = async (gradeName, gradeId) => {
    setGrade(gradeName);
    await dispatch(updateUserGrade({ userId: user.id, gradeId }));
  };

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
  }

  return (
    <>
    <ProfileCard className="p-4 md:p-8">
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
                className="relative border-[#aaaaaa] border-[0.5px] px-10"
              />
              <img src={flag} alt="Country" className="absolute top-[52%] md:top-1/2 right-8 w-8 md:w-auto" />
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
              <div className="w-full py-0 md:py-4 rounded-[100px] border-[0.5px] border-solid border-[#7a8085] flex items-center justify-between px-2 md:px-8">
                
                <span className="text-[#5d6062] text-sm md:text-lg font-medium text-nowrap">
                  {grade}
                </span>
                <ProfileButtons variant="outline" size="" className="w-[120px] md:w-[210px] py-2 cursor-pointer my-2 md:my-0" onClick={() => setIsModalOpen(true)}>
                  <img
                    className="w-4 md:w-6"
                    alt="Change"
                    src="https://c.animaapp.com/mf29nm7vjLRxgE/img/bold.svg"
                    />
                    <span className="text-navyteal text-sm md:text-base font-semibold text-nowrap">تغيير الصف</span>
                </ProfileButtons>
              </div>
            </div>
          </div>
        </div>

        <ProfileButtons variant="primary" size="" className="my-4 md:my-8 py-2 md:py-4 w-full max-w-6xl cursor-pointer bg-orangedeep hover:bg-btnClicked" onClick={handleSave}>
          <img
            className="w-4 md:w-6"
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
          onConfirm={handleConfirmGrade}
        />
    </>
  );
};

export default AccountInfo