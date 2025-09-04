import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Line } from "../../../utils/Illustrations";
import { STATUS_CONFIG } from "../../../constants/STATUS_CONFIG";

const StatusCard = ({
  title,
  image,
  status,
  subject,
  startDate,
  endDate,
  group,
  daysLeft,
  onRenew,
  onCancel,
  onReactivate,
}) => {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (open) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [open]);

  const config = STATUS_CONFIG[status] || STATUS_CONFIG["فعالة"];
  const Icon = config.icon;

  const handleAction = () => {
    if (config.actions.includes("renew")) onRenew?.();
    if (config.actions.includes("cancel")) onCancel?.();
    if (config.actions.includes("reactivate")) onReactivate?.();
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-300 lg:mb-4 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none"
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
          <h3 className="font-semibold text-xl text-navyteal">{title}</h3>
        </div>

        <div className="flex items-center justify-center gap-4">
          <span
            className={`text-sm px-3 py-1 rounded-full flex items-center justify-center gap-2 ${config.color}`}
          >
            {Icon && <Icon />}
            {config.label(daysLeft)}
          </span>
          {open ? (
            <ChevronUp className="w-5 h-5 text-gray-600 transition-transform duration-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600 transition-transform duration-300" />
          )}
        </div>
      </div>

      {/* Expandable Section */}
      <div
        ref={contentRef}
        style={{ height }}
        className="transition-all duration-500 ease-in-out overflow-hidden"
      >
        <div className="p-4 border-t border-gray-300 space-y-3 text-right">
          {/* Subscription Info */}
          <div className="flex items-start justify-between gap-4">
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

          {/* Group Info */}
          <p className="flex flex-col gap-4 mt-8">
            <span className="font-semibold text-[18px]">المجموعة:</span>{" "}
            <span className="text-status font-semibold text-2xl">{group}</span>
          </p>

          {/* Dynamic Action */}
          {config.actions.length > 0 && (
            <div className="flex flex-col items-center mt-8">
              <button
                onClick={handleAction}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-orangedeep w-full text-navyteal font-semibold rounded-full hover:bg-btnClicked transition cursor-pointer"
              >
                {config.buttonIcon && <config.buttonIcon />}
                {config.buttonText}
              </button>

              {config.message && (
                <div className="w-full mt-3 mb-4 text-[#B3261E] border border-[#8C8C8C] rounded-[64px] py-4 px-8 text-xl font-semibold">
                  <p className="max-w-[500px]">{config.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
