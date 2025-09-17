import { useState } from "react";
import { Cross, ConfirmCheck, DashedArrow, Arrow } from "@/utils/icons";
import Button from "../../../ui/Button";
import { formatArabicTime } from "../../../../utils/dateHelpers";
import { useSelector } from "react-redux";

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
  const groups = useSelector(
    (state) => state.subscriptions.groups[groupData.packageId] || []
  );

  return (
    <div className="relative sm:w-auto max-w-2xl bg-white rounded-2xl shadow-lg max-h-[80vh] flex flex-col">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center w-6 h-6 md:w-10 md:h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <Cross width="14" height="14" />
      </button>

      {/* Header */}
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-lg  md:text-2xl font-bold text-navyteal font-cairo mb-2">
            تغيير المجموعة
          </h2>
          <p className="text-navyteal text-sm">
            اختر المجموعة الجديدة المناسبة
          </p>
        </div>
        <hr className="border-t border-dashed border-subtext/50 mb-6" />
      </div>

      {/* Scroll only inside grid */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {groups.map((group) => {
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
                  {/* <div className=" flex items-center gap-3">
                    <input
                      type="radio"
                      name="group"
                      checked={selectedGroup === group.id}
                      onChange={() => setSelectedGroup(group.id)}
                      className="w-5 h-5 accent-orangedeep border-2 border-orangedeep focus:ring-orangedeep cursor-pointer"
                    />
                    <label className="font-semibold self-center text-gray-800 text-base font-cairo ">
                      {group.name}
                    </label>
                  </div> */}
                  <label
                    htmlFor={`group-${group.id}`}
                    className="flex items-center gap-3 cursor-pointer select-none"
                  >
                    <input
                      id={`group-${group.id}`}
                      type="radio"
                      name="group"
                      value={group.id}
                      checked={selectedGroup === group.id}
                      onChange={() => setSelectedGroup(group.id)}
                      className="sr-only peer"
                    />

                    {/* custom radio with pseudo-element bullet */}
                    <span
                      aria-hidden="true"
                      className="
                        relative w-5 h-5 rounded-full border-2 transition
                        border-gray-300
                        peer-checked:border-orangedeep
                        peer-focus-visible:outline-2 peer-focus-visible:outline-orangedeep/70
                        after:content-[''] after:absolute after:top-1/2 after:left-1/2
                        after:-translate-x-1/2 after:-translate-y-1/2
                        after:w-3 after:h-3 after:rounded-full after:bg-orangedeep
                        after:scale-0 peer-checked:after:scale-100 after:transition-transform
                      "
                    />

                    <span className="font-semibold self-center text-gray-800 text-base font-cairo">
                      {group.name}
                    </span>
                  </label>

                  {/* Group Details */}
                  <div className="flex-1 w-full">
                    {group.group_schedule[0]?.teacher_name && (
                      <p className="bg-status text-sm w-fit text-white rounded-full px-8 py-2">
                        {group.group_schedule[0]?.teacher_name || "—"}
                      </p>
                    )}

                    {/* عرض كل الأيام */}
                    {/* <div className="mt-2 space-y-1">
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
                              <span className="flex items-center gap-2 text-[#404040]">
                                الأيام:{" "}
                                <span className="text-navyteal">
                                  {daysMap[schedule.day_of_week] || "—"}
                                </span>
                              </span>
                                <DashedArrow />
                              <span className="text-[#BA7C28]">
                                {formatArabicTime(schedule.start_time) || "—"}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-400 text-sm">لا يوجد مواعيد</p>
                      )}
                    </div> */}
                    {/* عرض كل الأيام */}
                    <div className="mt-2 space-y-1">
                      {(() => {
                        const daysMap = {
                          monday: "الاثنين",
                          tuesday: "الثلاثاء",
                          wednesday: "الأربعاء",
                          thursday: "الخميس",
                          friday: "الجمعة",
                          saturday: "السبت",
                          sunday: "الأحد",
                        };

                        const sched = Array.isArray(group.group_schedule)
                          ? group.group_schedule.filter(Boolean)
                          : [];

                        if (sched.length === 0) {
                          return (
                            <p className="text-gray-400 text-sm">
                              لا يوجد مواعيد
                            </p>
                          );
                        }

                        // هل كل الأيام على نفس الوقت؟
                        const uniqueTimes = Array.from(
                          new Set(
                            sched.map((s) => s?.start_time).filter(Boolean)
                          )
                        );
                        const uniqueDays = Array.from(
                          new Set(
                            sched.map((s) => s?.day_of_week).filter(Boolean)
                          )
                        );

                        if (uniqueTimes.length === 1) {
                          // ---- حالة توحّد الوقت ----
                          const time = uniqueTimes[0];

                          return (
                            <>
                            <span className="text-[#404040] block">الأيام:</span>
                            <div className="space-y-2 text-sm text-gray-700">
                              {/* الأيام: يوم | يوم | يوم */}
                              <div className="flex items-center gap-2">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-navyteal">
                                  {uniqueDays.map((d, idx) => (
                                    <span
                                      key={`${group.id}-${d}-${idx}`}
                                      className="flex items-center"
                                    >
                                      <span>{daysMap[d] || "—"}</span>
                                      {idx < uniqueDays.length - 1 && (
                                        <span className="px-2 text-[#9aa1a7]">
                                          |
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* الوقت: يظهر مرة واحدة */}
                              <div className="flex items-center gap-2">
                                <span className="text-[#404040]">الوقت:</span>
                                <span className="text-[#BA7C28]">
                                  {formatArabicTime(time) || "—"}
                                </span>
                              </div>
                            </div>
                            </>
                          );
                        } 
                        return sched.map((schedule, idx) => (
                          <>
                          {idx === 0 && <span className="block">الأيام:</span>}
                          <div
                            key={
                              schedule.id ??
                              `${group.id}-${schedule.day_of_week}-${schedule.start_time}-${idx}`
                            }
                            className="flex items-center gap-2 text-sm text-[#404040]"
                          >
                            <span className="flex items-center text-[#404040]">
                              <span className="text-navyteal text-sm">
                                {daysMap[schedule.day_of_week] || "—"}
                              </span>
                            </span>

                            <DashedArrow className="w-7" />

                            {/* الوقت بدون كلمة "الوقت" */}
                            <span className="text-[#BA7C28] text-nowrap">
                              {formatArabicTime(schedule.start_time) || "—"}
                            </span>
                          </div>
                          </>
                        ));
                      })()}
                    </div>

                    {/* Current Group Badge */}
                    {group.id === groupData.currentGroupId && (
                      <div className="flex items-center gap-2 mt-2">
                        <Arrow />
                        <span className="inline-blockpx-2 py-1 text-status text-xs rounded">
                          المجموعة الحالية
                        </span>
                      </div>
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
          icon={<ConfirmCheck className="w-4" />}
          text="تأكيد التغيير"
          className="w-full text-navyteal font-medium"
        />
      </div>
    </div>
  );
};

export default ChangeGroupModal;
