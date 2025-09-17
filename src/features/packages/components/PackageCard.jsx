import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { STATUS_CONFIG } from "@/constants/STATUS_CONFIG";
import { Calender } from "@/utils/icons";
import { useModal } from "@/components/feedback/modal/useModal";
import { CardKite, Star } from "@/utils/Illustrations";
import * as Icons from "@/utils/icons";
import { usePackages } from "../hooks/usePackages";
import { useSelector } from "react-redux";
import {
  formatPackageStartDate,
  getRemainingDate,
  isPackageStarted,
} from "../../../utils/dateHelpers";
import { SandGlass } from "@/utils/icons";

const PackageCard = React.memo(
  ({ item, color, image, status, daysRemaining }) => {
    const { t } = useTranslation();
    const { openWeeklyScheduleModal, openStatusModal } = useModal();
    const { getSchedule } = usePackages();
    const schedules = useSelector((state) => state.packages.schedules);
    const { group_id, package_name, group_name, name } = item;

    const existingSchedule = useMemo(
      () => schedules?.[group_id],
      [schedules, group_id]
    );

const handleOpenSchedule = useCallback(async () => {
  const showError = (title, message) => {
    openStatusModal("ERROR", { title, message });
  };

  if (status === "expired") {
    showError("الجدول غير متاح", "لا يمكن عرض الجدول للباقات المنتهية.");
    return;
  }

  if (existingSchedule) {
    openWeeklyScheduleModal({
      data: {
        groupId: group_id,
        packageName: package_name,
        schedule: existingSchedule,
        image,
        color,
      },
    });
    return;
  }

  try {
    const { groupId, schedule } = await getSchedule(group_id).unwrap();

   

    openWeeklyScheduleModal({
      data: { groupId, packageName: package_name, schedule, image, color },
    });
  } catch (err) {
    showError("الجدول غير متاح", err?.message ?? "حدث خطأ أثناء محاولة جلب الجدول.");
  }
}, [
  status,
  existingSchedule,
  group_id,
  package_name,
  openStatusModal,
  openWeeklyScheduleModal,
  image,
  color,
  getSchedule,
]);

    // Status configuration
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.active;
    const Icon = Icons[config.icon];

    return (
      <div className="relative w-full mx-auto pl-3 max-w-2xl">
        {/* Decorative Star */}
        <div className="absolute z-20 -left-6 md:-left-8 -top-12 mt-2">
          <Star className="w-20 md:w-24" fill={color} />
        </div>

        {/* Card */}
        <div className="relative w-full transition-transform duration-300 pr-0">
          <div
            style={{ borderColor: color }}
            className="relative rounded-xl border bg-foundblue w-full overflow-hidden transform p-1 pb-0 pr-0 z-10 shadow-sm transition-all"
          >
            {/* Decorative Kite */}
            <div className="absolute flex items-start justify-end w-full -left-2 pt-8">
              <CardKite
                fill={color}
                className="relative -left-5 w-[120px] sm:w-[180px] md:w-[180px]"
              />
            </div>

            {/* Header */}
            <div className="flex flex-row xs:items-center gap-2 relative z-10 text-white px-3 py-4 bg-gradient-to-r">
              {image && (
                <div
                  style={{ backgroundColor: color }}
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded flex items-center justify-center p-1"
                >
                  <img src={image} alt={name} className="w-10 h-10" />
                </div>
              )}
              <div className="flex flex-col items-center pl-10 justify-center">
                <h2 className="text-sm sm:text-lg text-navyteal xs:text-xl font-semibold leading-snug">
                  {package_name ?? t("packages.healthPackage")}
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
              {isPackageStarted(item.package_start_date) && (
                <p className="text-navyteal font-semibold text-xs xs:text-sm md:text-lg truncate pl-20">
                  {group_name ?? t("packages.firstGroup")}
                </p>
              )}
            </div>

            {/* Schedule Button */}
            {isPackageStarted(item.package_start_date) ? (
              <div className="flex flex-row items-center justify-between gap-4 px-4 py-5 relative z-10">
                {status?.toLowerCase() !== "waiting" && (
                  <button
                    type="button"
                    onClick={handleOpenSchedule}
                    className="w-full space-x-1 text-navyteal text-xs xs:text-base flex items-center justify-center gap-1 max-w-60 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked cursor-pointer rounded-full px-4 py-3 font-medium transition-colors duration-300"
                    aria-label={t("packages.previewWeeklySchedule")}
                  >
                    <Calender className="w-4 h-4" />
                    <span>{t("packages.previewWeeklySchedule")}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="px-4  py-5 ">
                <span className="text-[#ba7c28]  font-semibold">الباقة لم تبداء بعد</span>
                <div className="flex flex-row items-center   relative z-10">
                  <Calender className="w-4 h-4" />

                  <span className="py-4 text-navyteal px-2">
                    {" "}
                    تاريخ بداية الباقة :{" "}
                    {formatPackageStartDate(item.package_start_date)}
                  </span>
                </div>
                <div className="flex flex-row items-center text-navyteal    relative z-10">
                  {" "}
                  <SandGlass className="w-3.5" fill="#08233F" />
                  <span className=" px-2">
                    {getRemainingDate(item.package_start_date)}{" "}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default PackageCard;
