import React, { useState } from "react";
import ModalContainer from "../ModalContainer";
import { Teacher, ChevronDown } from "@/utils/icons";
import { X } from "lucide-react";
const CommentsModal = ({ onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("شهري");

  // Sample comments data - in a real app, this would come from props or API
  const commentsData = {
    "شهري": [
      {
        id: 1,
        instructor: "أ. حنان",
        date: "منذ يومين",
        comment: "ممتازة ومجتهدة بس غير متفاعلة",
        canEdit: true
      },
      {
        id: 2,
        instructor: "أ. حنان", 
        date: "20/7/2025",
        comment: "ممتازة ومجتهدة بس غير متفاعلة",
        canEdit: true
      },
    ],
    "فصلي": [
      {
        id: 2,
        instructor: "أ. حنان",
        date: "منذ أسبوع",
        comment: "تحسن ملحوظ في الأداء هذا الشهر",
        canEdit: true
      },
    ]
  };

  const periods = [
    // { value: "اسبوعي", label: "اسبوعي" },
    { value: "شهري", label: "شهري" },
    { value: "فصلي", label: "فصلي" }
  ];

  const comments = commentsData[selectedPeriod] || [];

  return (
    <ModalContainer onClose={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full md:min-w-xl xl:min-w-2xl md:max-w-xl mx-auto max-h-[80vh] min-h-[60vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-navyteal" />
          </button>
          <h2 className="text-lg md:text-xl font-semibold text-navyteal text-center absolute left-1/2 -translate-x-1/2">التعليقات</h2>
        </div>

        {/* Separator */}
        <div className="border-t border-dashed border-gray-300 mb-4"></div>

        {/* Period Dropdown */}
        <div className="mb-6">
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-3 pr-4 pl-10 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orangedeep focus:border-transparent text-center"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-navyteal" />
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-[#F4F4F4] rounded-bl-[32px] rounded-br-[32px] rounded-tl-[32px] p-6 space-y-3">
                    {/* Comment Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-navyteal">
                        <Teacher className="w-4 h-4 md:w-6 md:h-6" />
                        <span className="text-sm md:text-base font-semibold">{comment.instructor}</span>
                      </div>
                      <span className="text-sm md:text-base font-semibold text-[#525D67]">{comment.date}</span>
                    </div>
                    
                    {/* Comment Text */}
                    <p className="text-sm md:text-base text-navyteal text-center leading-relaxed">
                      {comment.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>لا توجد تعليقات متاحة لهذه الفترة</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default CommentsModal;
