import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Cancel, ChangeGroup, Copon, Renew } from "../../../utils/icons";
import { Line } from "../../../utils/Illustrations";
import { STATUS_CONFIG } from "../../../constants/STATUS_CONFIG";
const ActiveCard = ({
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

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-300 lg:mb-4 overflow-hidden max-h-[]">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-4">
          {image && <img src={image} alt={title} className={`${config.bg} rounded h-[50px] w-[50px]`} />}
          <h3 className="font-semibold text-xl text-navyteal">{title}</h3>
        </div>

        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm px-3 py-1 rounded-full flex items-center justify-center gap-2 ${config.color}`}>
            <div className="">
              {Icon && <Icon />}
            </div> {config.label(daysLeft)}
          </span>
          {open ? (
            <ChevronUp className="w-5 h-5 text-gray-600 transition-transform duration-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600 transition-transform duration-300" />
          )}
        </div>
      </div>

      {/* Smooth expandable content */}
      <div
        ref={contentRef}
        style={{ height }}
        className="transition-all duration-500 ease-in-out overflow-hidden"
      >
        <div className="p-4 border-t border-gray-300 space-y-3 text-right">
          {/* Subscription info */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
            <Line className={config.lineColor} fill={config.fill} />
              <div className="flex flex-col justify-between items-start gap-6">
                <p className="flex gap-4">
                  <span className="font-semibold text-[#404040]">تاريخ الاشتراك:</span> {startDate}
                  </p>
                  <p className="flex gap-4">
                    <span className="font-semibold text-[#404040]">تاريخ الانتهاء:</span> {endDate}
                  </p>
                </div>
              </div>
            <p>
              <span className="font-medium text-[18px]">المواد: </span> 
              <span className="text-xl font-semibold">{subject}</span>
            </p>
          </div>

          {/* Active Card */}
          <div className="flex items-end justify-between">
            <p className="flex flex-col gap-4 mt-8">
              <span className="font-semibold text-[18px]">المجموعة:</span>{" "}
              <span className="text-status font-semibold text-2xl">{group}</span>
            </p>
          
            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-4">
           
              <button
                onClick={onChangeGroup}
                className="flex items-center gap-2 px-4 py-2 bg-orangedeep hover:bg-btnClicked transition text-navyteal font-semibold rounded-3xl cursor-pointer"
              >
                <ChangeGroup />
                تغيير المجموعة
              </button>
            
        
              <button
                onClick={onUseCoupon}
                className="flex items-center gap-2 px-4 py-2 border border-orangedeep text-navyteal rounded-3xl hover:bg-orange-50 font-semibold transition cursor-pointer"
              >
                <Copon />
                استخدام كوبون لإضافة أيام
              </button>
            
            </div>
          </div>

          <div className="flex justify-center mt-12">
            {config.actions.includes("cancel") && (
            <button
              onClick={onCancel}
              className="flex items-center justify-center gap-2 px-6 py-2 border w-full border-[#BA7C28] text-navyteal font-semibold rounded-full hover:bg-red-50 transition cursor-pointer"
            >
              <Cancel />
              إلغاء الاشتراك
            </button>
            )}
          </div>

          </div>
          </div>
    </div>
  );
};

export default ActiveCard;
