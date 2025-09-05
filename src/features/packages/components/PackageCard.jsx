import React, { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Calender,
  CorrectCircle,
  TelegramCircle,
  WhatsappCircle,
} from "@/utils/icons";
import WeeklySchedulePopup from "./WeeklySchedulePopup";
import { CardKite, PackagesBorder, Star } from "@/utils/Illustrations";

const PackageCard = React.memo(({ item, color, image }) => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const { t } = useTranslation();

        //   {
        //     "id": 12261,
        //     "package_name": "باقة مادة الرياضيات",
        //     "group_id": 754,
        //     "group_name": "المجموعة 1",
        //     "start_date": "2025-09-01",
        //     "end_date": "2025-09-03",
        //     "days_remaining": 1,
        //     "status": "trial",
        //     "package_start_date": "2025-08-09",
        //     "watsapp_link": "https://chat.whatsapp.com/Kv2gWmNXCvT7Hde7ucYz8g?mode=r_c"
        // },
  const SocialIcons = useMemo(() => [WhatsappCircle, TelegramCircle], []);

  const handleOpenSchedule = useCallback(() => setIsScheduleOpen(true), []);
  const handleCloseSchedule = useCallback(() => setIsScheduleOpen(false), []);

  return (
    <div className="relative w-full mx-auto px-4 pl-8 ">
      {/* Border Illustration */}

      {/* Decoration */}
      <div className="absolute z-20 -left-12 -top-15 ml-8 mt-2  ">
        <Star fill={color} />
      </div>

      {/* Card */}
      <div className="relative w-full transition-transform duration-300 pr-0  ">
        <div className="absolute w-full h-full ">
          <PackagesBorder
            stroke={color}
            className=" w-full h-full scale-105 "
          />
        </div>
        <div
          style={{ borderColor: color }}
          className={`relative rounded-xl border bg-foundblue border-[${color}] w-full overflow-hidden transform  skew-y-[0.1deg] p-2 pr-0 skew-x-2  z-10 shadow-sm transition-all `}
        >
          {/* Decorative Kite */}
          <div className="absolute flex items-start justify-end z w-full -left-2 pt-8">
            <CardKite fill={color} className="relative left-0" />
          </div>
          {/* Header */}
          <div
            className={`flex flex-row xs:items-center  gap-2 relative z-10 text-white  px-3 py-4 bg-gradient-to-r `}
          >
            <div className=" overflow-hidden  p-1">
              {image && (
                <div
                  style={{ backgroundColor: color }}
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded flex items-center justify-center"
                >
                  <img src={image} alt={item.name} className="w-10 h-10 " />
                </div>
              )}
            </div>

            <div>
              <h2 className=" text-sm  sm:text-lg text-navyteal xs:text-xl font-semibold leading-snug">
                {item.package_name ?? t('packages.healthPackage')}
              </h2>
              <h3 className="text-sm xs:text-base font-medium opacity-90">
                {item.description}
              </h3>
            </div>
          </div>

          {/* Status & Group */}
          <div className="flex  items-center gap-3  px-4 relative z-10">
            <div className="flex items-center gap-2 bg-[#FCF0E0] min-w-[100px] h-[34px] font-semibold rounded-3xl px-3 shadow-sm">
              <CorrectCircle className="w-4 h-4 text-status" />
              <span className="text-status text-xs xs:text-sm">
                {item.status ?? t('subscription.active')}
              </span>
            </div>
            <p className="text-navyteal font-semibold text-xs xs:text-sm">
              {item.group_name ?? t('packages.firstGroup')}
            </p>
          </div>

          {/* Schedule & Social */}
          <div className="flex flex-row items-center justify-between gap-4 px-4 py-5 relative z-10">
            {/* Schedule Button */}
            <button
              onClick={handleOpenSchedule}
              className="w-full   text-navyteal text-xs  xs:text-base flex items-center text-nowrap gap-1 max-w-60  bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked cursor-pointer rounded-full  px-4 py-2 sm:py-4  font-medium transition-colors duration-300"
            >
              <Calender />
              {t('packages.previewWeeklySchedule')}
            </button>

            {/* Social Icons */}
            <div className="flex items-center justify-between  w-full xs:w-auto  px-2 sm:px-4  border-[1px] border-[#5C6064]  rounded-full">
              {SocialIcons.map((Icon, idx) => (
                <button key={idx} className="   sm:p-2 rounded-full  ">
                  <Icon className="w-6 sm:w-18" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      <WeeklySchedulePopup open={isScheduleOpen} setOpen={handleCloseSchedule} />
    </div>
  );
});

export default PackageCard;
