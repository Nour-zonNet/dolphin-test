import React, { useState, useRef, useEffect } from "react";
import { Cancel, ChangeGroup, ChevronDown, ChevronUp, Copon, Renew } from "../../../utils/icons";
import { Line } from "../../../utils/Illustrations";
import { STATUS_CONFIG } from "../../../constants/STATUS_CONFIG";

const Card = ({
  title,
  image,
  status,
  subject,
  startDate,
  endDate,
  group,
  daysLeft,
  onChangeGroup,
  onUseCoupon,
  onCancel,
  onRenew,
}) => {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  // Smooth expand/collapse height handling
  useEffect(() => {
    if (open && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [open]);

  const config = STATUS_CONFIG[status] || STATUS_CONFIG["فعالة"];

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-gray-300 lg:mb-4 overflow-hidden">
      {/* Header Desktop layout */}
      <div
        className="hidden md:flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-4">
          {image && (
            <img
              src={image}
              alt={title}
              className={`${config.bg} rounded h-[50px] w-[50px]`}
            />
          )}
          <h3 className="font-semibold md:text-xl text-sm text-navyteal">{title}</h3>
        </div>

        <div className="flex items-center justify-center gap-4">
          <span
            className={`text-sm px-3 py-1 rounded-full flex items-center justify-center gap-2 ${config.color}`}
          >
            {config.icon && <config.icon />}
            {config.label(daysLeft)}
          </span>
          {open ? (
            <ChevronUp className="w-3 h-3 text-gray-600 transition-transform duration-300" />
          ) : (
            <ChevronDown className="w-3 h-3 text-gray-600 transition-transform duration-300" />
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div
        className="md:hidden flex flex-col md:flex-row p-4 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {image && (
                <img
                  src={image}
                  alt={title}
                  className={`${config.bg} rounded h-[50px] w-[50px]`}
                />
              )}
              <h3 className="font-semibold md:text-xl text-sm text-navyteal">{title}</h3>
            </div>
            {open ? (
            <ChevronUp className="w-3 h-3 text-gray-600 transition-transform duration-300" />
          ) : (
            <ChevronDown className="w-3 h-3 text-gray-600 transition-transform duration-300" />
          )}
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <span
            className={`text-sm px-3 py-1 rounded-full flex items-center justify-center gap-2 ${config.color}`}
          >
            {config.icon && <config.icon />}
            {config.label(daysLeft)}
          </span>

        </div>
      </div>

      {/* Expandable Content */}
      <div
        ref={contentRef}
        style={{ height }}
        className="transition-all duration-500 ease-in-out overflow-hidden"
      >
        <div className="p-4 border-t border-gray-300 space-y-3 text-right">
          {/* Subscription Info */}
          <div className="flex items-start justify-between flex-col md:flex-row gap-4">
            <div className="flex items-center gap-4">
              <Line className={config.lineColor} fill={config.fill} />
              <div className="flex flex-col justify-between items-start gap-6">
                <p className="flex gap-4">
                  <span className="font-semibold text-[#404040]">
                    تاريخ الاشتراك:
                  </span>
                  {startDate}
                </p>
                <p className="flex gap-4">
                  <span className="font-semibold text-[#404040]">
                    تاريخ الانتهاء:
                  </span>
                  {endDate}
                </p>
              </div>
            </div>
            <p>
              <span className="font-medium text-[18px]">المواد: </span>
              <span className="text-xl font-semibold">{subject}</span>
            </p>
          </div>

          {/* Group Info (if allowed) Tablet and desktop layout */}
          <div className="items-end justify-between flex-col md:flex-row hidden md:flex">
            {config.actions.includes("changeGroup") && (
              <p className="flex flex-row md:flex-col gap-4 mt-8">
                <span className="font-semibold md:text-[18px] text-sm">المجموعة:</span>
                <span className="text-status font-semibold md:text-2xl text-[16px]">
                  {group}
                </span>
              </p>
            )}

            {/* Top Actions */}
            <div className="flex flex-wrap gap-3 md:mt-4 mt-2">
              {config.actions.includes("changeGroup") && (
                <button
                  onClick={onChangeGroup}
                  className="flex items-center gap-2 px-4 py-3 bg-orangedeep hover:bg-btnClicked transition text-navyteal font-semibold rounded-3xl cursor-pointer"
                >
                  <ChangeGroup /> تغيير المجموعة
                </button>
              )}
              {config.actions.includes("useCoupon") && (
                <button
                  onClick={onUseCoupon}
                  className="flex items-center gap-2 px-4 py-3 md:w-auto w-full border border-orangedeep text-navyteal rounded-3xl hover:bg-orange-50 font-semibold transition cursor-pointer"
                >
                  <Copon /> استخدام كوبون لإضافة أيام
                </button>
              )}
            </div>
          </div>

          {/* Cancel Button */}
          {config.actions.includes("cancel") && (
            <div className="md:flex justify-center md:mt-12 mt-4 hidden">
              <button
                onClick={onCancel}
                className="flex items-center justify-center gap-2 mb-4 px-6 py-3 border w-full border-orangedeep text-navyteal font-semibold rounded-full hover:bg-red-50 transition cursor-pointer"
              >
                <Cancel /> إلغاء الاشتراك
              </button>
            </div>
          )}

          {/* Group Info (if allowed) Mobile layout*/}
          <div className="flex justify-between flex-col md:flex-row md:hidden">
            <div className="flex items-center justify-between">
              {config.actions.includes("changeGroup") && (
                <p className="flex flex-row md:flex-col gap-2 mt-8">
                  <span className="font-semibold md:text-[18px] text-sm">المجموعة:</span>
                  <span className="text-status font-semibold md:text-2xl text-[16px]">
                    {group}
                  </span>
                </p>
              )}
              {config.actions.includes("changeGroup") && (
                <button
                  onClick={onChangeGroup}
                  className="flex items-center gap-1 text-nowrap px-2 py-2 bg-orangedeep hover:bg-btnClicked transition text-navyteal font-semibold rounded-3xl cursor-pointer text-sm"
                >
                  <ChangeGroup /> تغيير المجموعة
                </button>
              )}
            </div>
            {/* Top Actions */}
            <div className="flex flex-wrap gap-3 md:mt-4 mt-8">
              {config.actions.includes("useCoupon") && (
                <button
                  onClick={onUseCoupon}
                  className="flex items-center justify-center gap-2 px-4 py-3 w-full border border-orangedeep text-navyteal rounded-3xl hover:bg-orange-50 font-semibold transition cursor-pointer"
                >
                  <Copon /> استخدام كوبون لإضافة أيام
                </button>
              )}
            </div>
          </div>

          {/* Cancel Button */}
          {config.actions.includes("cancel") && (
            <div className="md:hidden justify-center md:mt-12 mt-4 flex">
              <button
                onClick={onCancel}
                className="flex items-center justify-center gap-2 mb-4 px-6 py-3 border w-full border-orangedeep text-navyteal font-semibold rounded-full hover:bg-red-50 transition cursor-pointer"
              >
                <Cancel /> إلغاء الاشتراك
              </button>
            </div>
          )}

          {/* Other Status Button + Message */}
          {(config.actions.includes("renew") ||
            config.actions.includes("canceled") ||
            config.actions.includes("reactivate")) && (
            <div className="flex flex-col items-center mt-6">
              <button
                onClick={onRenew}
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm md:text-[16px] bg-orangedeep w-full text-navyteal font-semibold rounded-full hover:bg-btnClicked transition cursor-pointer"
              >
                <Renew /> {config.buttonText}
              </button>

              {config.message && (
                <div className="bg-[#F9F9F9] w-full mt-6 mb-4 text-[#B3261E] border border-[#8C8C8C] rounded-[64px] py-4 px-8 text-xl font-semibold">
                  <p className="text-wrap text-sm md:text-[16px]">{config.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
