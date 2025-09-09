import { useState } from "react";
import { Cross, Check } from "../../../../utils/icons";
import Button from "../../../ui/Button";
import { formatArabicTime } from "../../../../utils/dateHelpers";

const ChangeGroupModal = ({ onClose, onConfirm, groupData = {} }) => {
  const [selectedGroup, setSelectedGroup] = useState(
    groupData.currentGroupId || 1
  );

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(selectedGroup);
    }
    onClose();
  };

  return (
    <div
      className="relative   sm:w-auto   max-w-2xl bg-white rounded-2xl shadow-lg max-h-[80vh] flex flex-col"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
      >
        <Cross width="14" height="14" />
      </button>

      {/* Header */}
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-lg  md:text-2xl font-bold text-navyteal font-cairo mb-2">
            تغيير المجموعة
          </h2>
          <p className="text-gray-600 text-sm">
            اختر المجموعة الجديدة المناسبة
          </p>
        </div>
        <hr className="border-t border-dashed border-subtext/50 mb-6" />
      </div>

      {/* Scroll only inside grid */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {groupData.groups.map((group) => {
            return (
              <div
                key={group.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedGroup === group.id
                    ? "border-orangedeep "
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedGroup(group.id)}
              >
                <div className="flex flex-col items-start space-y-3">
                  {/* Radio + Group Name */}
                  <div className=" flex items-center gap-3">
                    <input
                      type="radio"
                      name="group"
                      checked={selectedGroup === group.id}
                      onChange={() => setSelectedGroup(group.id)}
                      className="w-5 h-5 text-orangedeep border-2 border-orangedeep focus:ring-orangedeep cursor-pointer"
                    />
                    <label className="font-semibold self-center text-gray-800 text-base font-cairo ">
                      {group.name}
                    </label>
                  </div>

                  {/* Group Details */}
                  <div className="flex-1 w-full">
                    {group.group_schedule[0]?.teacher_name && (
                      <p className="bg-status text-sm w-fit text-white rounded-full px-8 py-2">
                        {group.group_schedule[0]?.teacher_name || "—"}
                      </p>
                    )}

                    {/* عرض كل الأيام */}
                    <div className="mt-2 space-y-1">
                      {group.group_schedule.length > 0 ? (
                        group.group_schedule.map((schedule) => {
                          const daysMap = {
                            monday: "الاثنين",
                            tuesday: "الثلاثاء",
                            wednesday: "الأربعاء",
                            thursday: "الخميس",
                            friday: "الجمعة",
                            saturday: "السبت",
                            sunday: "الأحد",
                          };

                          return (
                            <div
                              key={schedule.id}
                              className="flex items-center justify-between text-sm text-gray-700"
                            >
                              <span>
                                اليوم:{" "}
                                <span className="text-[#BA7C28]">
                                  {daysMap[schedule.day_of_week] || "—"}
                                </span>
                              </span>
                              <span>
                                الوقت:{" "}
                                {formatArabicTime(schedule.start_time) || "—"}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-400 text-sm">لا يوجد مواعيد</p>
                      )}
                    </div>

                    {/* Current Group Badge */}
                    {group.id === groupData.currentGroupId && (
                      <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                        المجموعة الحالية
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <div className="p-6">
        <Button
          onClick={handleConfirm}
          icon={<Check color="#08233f" />}
          text="تأكيد التغيير"
          className="w-full text-navyteal font-medium"
        />
        <p className="text-center text-gray-500 text-sm mt-2">
          بعد الضغط على تأكيد عند تغيير المجموعة
        </p>
      </div>
    </div>
  );
};

export default ChangeGroupModal;
