import React, { useState, useCallback } from "react";
import { DatePicker } from "@/utils/icons";
import AllPackagesSchedulePopup from "@/features/lessons/pages/LessonContentPage/components/AllPackagesSchedulePopup";

const PreviewScheduleBtn = ({
  groupInfos, // [{ groupId, label?, color? }]
  className = "",
  label = "معاينة الجدول الاسبوعي",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback((e) => {
    e?.stopPropagation?.();
    setIsOpen(true);
  }, []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={`flex items-center justify-center gap-2 bg-orangedeep text-darkblue px-4 py-2 lg:py-3 rounded-full w-full lg:w-1/3 mx-auto my-6 lg:my-0 hover:bg-btnClicked focus:bg-btnClicked cursor-pointer ${className}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <DatePicker className="w-4 md:w-6" />
        <span className="text-nowrap text-sm md:text-base lg:text-lg font-semibold">{label}</span>
      </button>

      <AllPackagesSchedulePopup
        open={isOpen}
        onClose={handleClose}      
        groupInfos={groupInfos}
      />
    </>
  );
};

export default PreviewScheduleBtn;
