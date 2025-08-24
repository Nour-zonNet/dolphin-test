import { useState } from "react";
import {
  Calender,
  CorrectCircle,
  TelegramCircle,
  WhatsappCircle,
} from "@/utils/icons";
import WeeklySchedulePopup from "./WeeklySchedulePopup";
import Tooth from "@/assets/images/Tooth.svg";
import { CardKite, PackagesBorder, Star } from "@/utils/Illustrations";

const PackageCard = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full mx-auto  ">
      {/* Border Illustration */}

      {/* Decoration */}
      <div className="absolute z-20 -left-12 -top-15">
        <Star />
      </div>

      {/* Card */}
      <div className="relative w-full transition-transform duration-300  pr-0 pl-2  ">
        <div className="absolute w-full h-full ">
          <PackagesBorder className=" w-full h-full scale-x-105 scale-y-125" />
        </div>
        <div className="relative rounded-xl border bg-foundblue border-health w-full overflow-hidden transform  skew-y-[0.1deg] p-2 pr-0 pl-    skew-x-2  z-10 shadow-sm transition-all ">
          {/* Decorative Kite */}
          <div className="absolute flex items-start justify-end z-20 w-full -left-2 pt-8">
            <CardKite className="relative left-0" />
          </div>

          {/* Header */}
          <div
            className={`flex flex-col xs:flex-row xs:items-center gap-2 relative z-10 text-white px-3 py-4 bg-gradient-to-r ${item.color}`}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-10 h-10 xs:w-12 xs:h-12 drop-shadow-md"
              />
            ) : (
              <>
                <div className="bg-health rounded p-1">
                  <img
                    src={Tooth}
                    className="w-8 h-8 sm:w-12 sm:h-12"
                    alt="tooth"
                  />
                </div>
              </>
            )}
            <div>
              <h2 className="text-lg text-navyteal xs:text-xl font-semibold leading-snug">
                {item.title ?? "باقة الصحة العامة"}
              </h2>
              <h3 className="text-sm xs:text-base font-medium opacity-90">
                {item.description}
              </h3>
            </div>
          </div>

          {/* Status & Group */}
          <div className="flex flex-wrap items-center gap-3  px-4 relative z-10">
            <div className="flex items-center gap-2 bg-[#FCF0E0] min-w-[100px] h-[34px] font-semibold rounded-3xl px-3 shadow-sm">
              <CorrectCircle className="w-4 h-4 text-status" />
              <span className="text-status text-xs xs:text-sm">
                {item.status ?? "فعالة"}
              </span>
            </div>
            <p className="text-navyteal font-semibold text-xs xs:text-sm">
              {item.group ?? "المجموعة الاولى"}
            </p>
          </div>

          {/* Schedule & Social */}
          <div className="flex flex-col xs:flex-row items-center justify-between gap-4 px-4 py-5 relative z-10">
            {/* Schedule Button */}
            <button
              onClick={() => setOpen(true)}
              className="w-full xs:w-[280px] h-[48px] text-navyteal text-[15px] xs:text-[16px] flex items-center justify-center gap-3 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked cursor-pointer rounded-3xl px-4 font-medium transition-colors duration-300"
            >
              <Calender />
              معاينة الجدول الأسبوعي
            </button>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-4 h-[50px] w-full xs:w-auto px-4  border-[1px] border-[#5C6064]  rounded-3xl">
              {[WhatsappCircle, TelegramCircle].map((Icon, idx) => (
                <button key={idx} className="p-2 rounded-full  ">
                  <Icon />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      <WeeklySchedulePopup open={open} setOpen={setOpen} />
    </div>
  );
};

export default PackageCard;
