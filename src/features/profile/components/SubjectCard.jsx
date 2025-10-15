import { PerformanceArrowUp, PerformanceArrowDown, Eye, PdfDownload, Performance, Teacher } from "@/utils/icons";
import { packageStyles } from "@/constants/PACKAGE_COLORS";
import { useModal } from "@/components/feedback/modal/useModal";
import { useCallback } from "react";

const getPerformanceConfig = (rating) => {
  const configs = {
    "ممتاز": { color: "bg-[#27C840]", textColor: "text-[#27C840]" },
    "جيد جدا": { color: "bg-[#27C840]", textColor: "text-[#27C840]" },
    "جيد": { color: "bg-[#27C840]", textColor: "text-[#27C840]" },
    "مقبول": { color: "bg-orangedeep", textColor: "text-orangedeep" },
    "يحتاج تحسين": { color: "bg-[#7A8085]", textColor: "text-[#7A8085]" }
  };
  return configs[rating] || configs["مقبول"];
};

const SubjectCard = ({ subject, period, hasScroll = false }) => {
  const performanceConfig = getPerformanceConfig(subject.rating);
  const { openCommentsModal, openPerformanceChartModal } = useModal();
  
  // Get dynamic icon from packageStyles
  const packageStyle = packageStyles[subject.packageId];
  const SubjectIcon = packageStyle?.image;
  
  const getPeriodText = (trendText, period) => {
    if (period === "month") {
      return trendText.replace("الاسبوع", "الشهر").replace("الأسبوع", "الشهر");
    }
    if (period === "quarter") {
      return trendText.replace("الاسبوع", "الفصل").replace("الأسبوع", "الفصل").replace("هذا الاسبوع", "هذا الفصل").replace("الأسبوع الماضي", "الفصل الماضي");
    }
    return trendText;
  };

  const handleCommentsClick = useCallback(() => {
    openCommentsModal(subject);
  }, [openCommentsModal, subject]);

  const handlePerformanceClick = useCallback(() => {
    openPerformanceChartModal(subject, period);
  }, [openPerformanceChartModal, subject, period]);

  return (
    <div 
      className={`border border-[#E8E8E8] rounded-xl p-6 space-y-4 ${hasScroll ? 'me-4' : ''}`}
    >
      {/* Subject Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {SubjectIcon && (
            <div 
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ backgroundColor: packageStyle?.bgColor }}
            >
              <img src={SubjectIcon} alt={subject.name} className="w-6 h-6" />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <h3 className="text-navyteal text-lg font-semibold">{subject.name}</h3>
            <div className="flex items-center gap-2 text-navyteal">
              <Teacher className="w-4 h-4 md:w-6 md:h-6" />
              <span className="font-semibold text-sm md:text-base text-navyteal">{subject.instructor}</span>
            </div>
          </div>
        </div>
        <span className={`py-1.5 rounded-full text-white text-sm font-medium min-w-[80px] md:min-w-[120px] text-center ${performanceConfig.color}`}>
          {subject.rating}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full border border-[#D9D9D9] h-4 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orangedeep transition-all duration-300 rounded-full"
            style={{ width: `${subject.progress}%` }}
          />
        </div>
        
        {/* Trend */}
        <div className="flex items-center gap-2 mt-4">
          {subject.trend === "up" ? (
            <PerformanceArrowUp />
          ) : (
            <PerformanceArrowDown />
          )}
          <span className={`text-sm ${subject.trend === "down" ? "text-red-500" : "text-green-500"}`}>
            {getPeriodText(subject.trendText, period)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        {/* Comments Button */}
        <button 
          onClick={handleCommentsClick}
          className="flex items-center gap-2 px-6 py-2 border border-orangedeep text-orangedeep rounded-full hover:bg-orangedeep hover:text-white transition-colors cursor-pointer"
        >
          {/* <Eye /> */}
          <span>التعليقات</span>
        </button>
        <div className="flex items-center gap-3">
          {/* PDF Download Button */}
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#C4D6E1] hover:bg-[#BEDCEF] transition-colors cursor-pointer">
            <PdfDownload className="w-5 h-5" />
          </button>
          {/* Statistics Button */}
          <button 
            onClick={handlePerformanceClick}
            className="w-10 h-10 bg-orangedeep rounded-full flex items-center justify-center hover:bg-btnClicked transition-colors cursor-pointer"
          >
            <Performance className="w-5 h-5 text-navyteal" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
