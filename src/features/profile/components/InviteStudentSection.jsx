import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedArrow } from "@/utils/icons";
import giftImage from "@/assets/images/gift.png";

const InviteStudentSection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/referral");
  };

  return (
    <>
      <style>{`
        @keyframes moveBackAndForth {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-8px);
          }
        }
        .animate-back-forth {
          animation: moveBackAndForth 1.5s ease-in-out infinite;
        }
      `}</style>
      <div 
        onClick={handleClick}
        className="relative p-4 sm:p-6 border border-[#D9D9D9] rounded-[16px] min-h-[140px] sm:min-h-[170px] cursor-pointer hover:border-orangedeep transition-all duration-300 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-4 sm:gap-6">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
            <div className="flex flex-col gap-1 sm:gap-2 flex-1">
              <h3 className="font-bold text-black text-base sm:text-lg md:text-xl lg:text-2xl">
                ادعُ أصدقاءك            
              </h3>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-black leading-relaxed">
                ادعُ أصدقاءك واكسب مكافآت عن كل صديق ينضم            
              </p>
            </div>
          </div>
          <div className="">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="cursor-pointer animate-back-forth p-2 hover:scale-110 transition-transform"
              aria-label="Invite friends"
            >
              <AnimatedArrow />
              </button>
              <img
                  src={giftImage}
                  alt="Gift"
                  className="object-contain absolute bottom-0 left-10 w-16 md:w-auto"
              />
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteStudentSection;

