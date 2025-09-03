import { useState } from "react";
import { Cross, Check } from "../../../../utils/icons";
import Button from "../../../ui/Button";

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
    <div className="relative w-full max-w-2xl bg-white rounded-2xl p-6 shadow-lg mx-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
      >
        <Cross width="14" height="14" />
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-navyteal font-cairo mb-2">
          تغيير المجموعة
        </h2>
        <p className="text-gray-600 text-sm">اختر المجموعة الجديدة المناسبة</p>
      </div>
      <hr className="border-t border-dashed border-subtext/50 mb-6" />

      {/* Group Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {groupData.groups.map((group) => (
          <div
            key={group.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedGroup === group.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedGroup(group.id)}
          >
            <div className="flex items-start space-x-3 space-x-reverse">
              <input
                type="radio"
                name="group"
                checked={selectedGroup === group.id}
                onChange={() => setSelectedGroup(group.id)}
                className="mt-1 text-blue-600"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 font-cairo mb-2">
                  {group.name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>المدرب: {group.instructor}</p>
                  <p>{group.days}</p>
                  <p>{group.time}</p>
                  {group.isCurrent && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                      المجموعة الحالية
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="flex justify-center mb-4">
        <Button
          onClick={handleConfirm}
          icon={<Check color="#08233f" />}
          text="تأكيد التغيير"
          className="w-full text-navyteal  font-medium "
        />
      </div>

      {/* Instruction Text */}
      <p className="text-center text-gray-500 text-sm">
        بعد الضغط على تأكيد عند تغيير المجموعة
      </p>
    </div>
  );
};

export default ChangeGroupModal;
