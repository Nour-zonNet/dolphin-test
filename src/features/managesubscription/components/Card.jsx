import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Card = ({
  title,
  icon,
  status,
  statusColor = "bg-yellow-100 text-yellow-700",
  subject,
  startDate,
  endDate,
  group,
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

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 lg:mb-4 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          {icon && <img src={icon} alt={title} className="" />}
          <h3 className="font-bold text-gray-800">{title}</h3>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`text-sm px-3 py-1 rounded-full flex items-center gap-1 ${statusColor}`}
          >
            ✅ {status}
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
        <div className="p-4 border-t border-gray-200 space-y-3 text-right">
          <p>
            <span className="font-semibold">المواد:</span> {subject}
          </p>
          <p>
            <span className="font-semibold">تاريخ الاشتراك:</span> {startDate}
          </p>
          <p>
            <span className="font-semibold">تاريخ الانتهاء:</span> {endDate}
          </p>

          <p>
            <span className="font-semibold">المجموعة:</span>{" "}
            <span className="text-blue-600 font-bold">{group}</span>
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={onUseCoupon}
              className="px-4 py-2 border border-orange-400 text-orange-600 rounded-full hover:bg-orange-50 transition"
            >
              استخدام كوبون لإضافة أيام
            </button>

            <button
              onClick={onChangeGroup}
              className="px-4 py-2 border border-yellow-400 text-yellow-600 rounded-full hover:bg-yellow-50 transition"
            >
              تغيير المجموعة
            </button>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-red-500 text-red-600 rounded-full hover:bg-red-50 transition"
            >
              إلغاء الاشتراك
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
