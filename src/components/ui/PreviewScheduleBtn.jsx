import React, { useState, useCallback } from "react";
import { DatePicker } from "@/utils/icons";
import AllPackagesSchedulePopup from "@/features/lessons/pages/LessonContentPage/components/AllPackagesSchedulePopup";
import { useDispatch } from "react-redux";
import { fetchLessons } from "@/features/lessons/store/lessonsSlice";

const PreviewScheduleBtn = ({
  groupInfos,
  className = "",
  label = "معاينة الجدول الأسبوعي",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleOpen = useCallback(async () => {
    try {
      await dispatch(fetchLessons()).unwrap();
      setIsOpen(true);
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
    }
  }, [dispatch]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={`flex items-center justify-center gap-2 bg-orangedeep text-darkblue 
          px-4 lg:px-6 py-2.5 lg:py-3 rounded-full w-full mx-auto my-6 lg:my-0 
          hover:bg-btnClicked focus:bg-btnClicked transition-colors duration-200 
          cursor-pointer ${className}`}
      >
        <DatePicker className="w-4 md:w-6" />
        <span className="text-nowrap text-sm md:text-base font-semibold lg:font-medium">
          {label}
        </span>
      </button>

      {isOpen && (
        <AllPackagesSchedulePopup
          open={isOpen}
          onClose={handleClose}
          groupInfos={groupInfos}
        />
      )}
    </>
  );
};

export default PreviewScheduleBtn;
