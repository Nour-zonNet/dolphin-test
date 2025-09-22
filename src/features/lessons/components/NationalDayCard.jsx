import React from "react";

const NationalDayCard = ({ src, alt = "Saudi National Day", className = "" }) => {
    return (
        <div className={`w-full flex flex-col items-center justify-center z-50 ${className}`}>
            <img
                src={src}
                alt={alt}
                loading="lazy"
                className="h-auto rounded-2xl w-[70%] md:w-auto"
            />
            <p className="text-[#155274] font-semibold text-lg lg:text-2xl text-center mt-4 mb-4 md:mb-0">
            لا توجد دروس اليوم بمناسبة اليوم <br /> الوطني السعودي استمتعوا بإجازتكم
            </p>
        </div>
    );
};

export default NationalDayCard;
