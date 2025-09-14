import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { STATUS_CONFIG } from "@/constants/STATUS_CONFIG";
import { Calender } from "@/utils/icons";
import { useModal } from "@/components/feedback/modal/useModal";
import { CardKite, Star } from "@/utils/Illustrations";
import * as Icons from "@/utils/icons";
import { usePackages } from "../hooks/usePackages";
import { useSelector } from "react-redux";

const PackageCard = React.memo(
  ({ item, color, image, status, daysRemaining }) => {
    const { t } = useTranslation();
    const { openWeeklyScheduleModal, openStatusModal } = useModal();
    const { getSchedule } = usePackages();
    const schedules = useSelector((state) => state.packages.schedules);

    const handleOpenSchedule = useCallback(async () => {
      const existingSchedule = schedules?.[item.group_id];

      if (existingSchedule) {
        openWeeklyScheduleModal({
          data: {
            groupId: item.group_id,
            packageName: item.package_name,
            schedule: existingSchedule,
            image,
            color,
          },
        });
        return;
      }

      try {
        const { groupId, schedule } = await getSchedule(item.group_id).unwrap();

        if (!schedule || Object.keys(schedule).length === 0) {
          openStatusModal("INFO", {
            title: "لا يوجد جدول متاح",
            message: "لا يوجد جدول متاح لهذه الباقة في الوقت الحالي.",
          });
          return;
        }

        openWeeklyScheduleModal({
          data: {
            groupId,
            packageName: item.package_name,
            schedule: schedule ?? {},
            image,
            color,
          },
        });
      } catch {
        openStatusModal("ERROR", {
          title: "خطأ في جلب الجدول",
          message: "حدث خطأ أثناء محاولة جلب الجدول.",
        });
      }
    }, [
      schedules,
      getSchedule,
      item.group_id,
      item.package_name,
      openWeeklyScheduleModal,
      image,
      color,
      openStatusModal,
    ]);

    // Get the status configuration
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.active;
    const Icon = Icons[config.icon];
    return (
      <div className="relative w-full mx-auto pl-3 max-w-2xl">
        {/* Border Illustration */}

        {/* Decoration */}
        <div className="absolute z-20 -left-6 md:-left-8 -top-15 mt-2">
          <Star className="w-20 md:w-24" fill={color} />
        </div>

        {/* Card */}
        <div className="relative w-full transition-transform duration-300 pr-0">
          <div
            style={{ borderColor: color }}
            className={`relative rounded-xl border bg-foundblue w-full overflow-hidden transform p-1 pb-0 pr-0  z-10 shadow-sm transition-all`}
          >
            {/* Decorative Kite */}
            <div className="absolute flex items-start justify-end w-full -left-2 pt-8">
              <CardKite
                fill={color}
                className="relative -left-5 w-30 sm:w-45 md:w-45"
              />
            </div>

            {/* Header */}
            <div
              className={`flex flex-row xs:items-center gap-2 relative z-10 text-white px-3 py-4 bg-gradient-to-r`}
            >
              <div className="overflow-hidden p-1">
                {image && (
                  <div
                    style={{ backgroundColor: color }}
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded flex items-center justify-center"
                  >
                    <img src={image} alt={item.name} className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center pl-10 justify-center">
                <h2 className="text-sm sm:text-lg text-navyteal xs:text-xl font-semibold leading-snug">
                  {item.package_name ?? t("packages.healthPackage")}
                </h2>
              </div>
            </div>

            {/* Status & Group */}
            <div className="flex items-center flex-wrap gap-3 px-4 relative z-10">
              <div
                className={`flex items-center justify-center gap-2 rounded-3xl px-2 py-1 ${config.color}`}
              >
                <Icon className="w-5" />
                <span className="font-semibold text-sm md:text-base">
                  {typeof config.label === "function"
                    ? config.label(daysRemaining)
                    : config.label}
                </span>
              </div>

              <p className="text-navyteal font-semibold text-xs xs:text-sm md:text-lg truncate pl-20">
                {item.group_name ?? t("packages.firstGroup")}
              </p>
            </div>

            {/* Schedule & Social */}
            <div className="flex flex-row items-center justify-between md:justify-between gap-4 px-4 py-5 relative z-10">
              {/* إخفاء زر معاينة الجدول للباقات في حالة الانتظار */}
              {status?.toLowerCase() !== "waiting" && (
                <button
                  type="button"
                  onClick={handleOpenSchedule}
                  className="w-full space-x-1 text-navyteal text-xs xs:text-base flex items-center justify-center text-nowrap gap-1 max-w-60 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked cursor-pointer rounded-full px-4 py-2 sm:py-3 font-medium transition-colors duration-300"
                >
                  <Calender className="w-4 h-4" />
                  <span>{t("packages.previewWeeklySchedule")}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default PackageCard;
