import { Header } from "@/components";
import { useState } from "react";
import { PeriodDropdown, SubjectCard, PerformanceChart } from "../components";
// import { packageStyles } from "@/constants/PACKAGE_COLORS";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Monthly data - comparing weeks within the month
  const monthlySubjects = [
    {
      id: 1,
      name: "مادة الصحة العامة",
      instructor: "أ. حنان",
      packageId: 114,
      rating: "ممتاز",
      progress: 95,
      trend: "up",
      trendText: "أداؤك هذا الشهر أفضل من الشهر الماضي",
      hasComments: false,
      weeklyComparison: {
        week1: 85,
        week2: 90,
        week3: 92,
        week4: 95
      }
    },
    {
      id: 2,
      name: "مادة ركن المسلم",
      instructor: "أ. حنان",
      packageId: 162,
      rating: "جيد",
      progress: 75,
      trend: "down",
      trendText: "أداؤك هذا الشهر أقل من الشهر الماضي",
      hasComments: true,
      weeklyComparison: {
        week1: 80,
        week2: 78,
        week3: 76,
        week4: 75
      }
    },
    {
      id: 3,
      name: "مادة الرياضيات",
      instructor: "أ. أحمد",
      packageId: 135,
      rating: "جيد جدا",
      progress: 88,
      trend: "up",
      trendText: "أداؤك هذا الشهر أفضل من الشهر الماضي",
      hasComments: false,
      weeklyComparison: {
        week1: 82,
        week2: 85,
        week3: 87,
        week4: 88
      }
    },
    {
      id: 4,
      name: "مادة العلوم",
      instructor: "أ. فاطمة",
      packageId: 193,
      rating: "يحتاج تحسين",
      progress: 45,
      trend: "down",
      trendText: "أداؤك هذا الشهر أقل من الشهر الماضي",
      hasComments: true,
      weeklyComparison: {
        week1: 50,
        week2: 48,
        week3: 46,
        week4: 45
      }
    },
    
  ];

  // Quarterly data - 3 months performance
  const quarterlySubjects = [
    {
      id: 1,
      name: "مادة الصحة العامة",
      instructor: "أ. حنان",
      packageId: 113,
      rating: "ممتاز",
      progress: 92,
      trend: "up",
      trendText: "أداؤك هذا الفصل أفضل من الفصل الماضي",
      hasComments: false,
      monthlyPerformance: {
        month1: 88,
        month2: 90,
        month3: 92
      }
    },
    {
      id: 2,
      name: "مادة ركن المسلم",
      instructor: "أ. حنان",
      packageId: 162,
      rating: "جيد",
      progress: 78,
      trend: "down",
      trendText: "أداؤك هذا الفصل أقل من الفصل الماضي",
      hasComments: true,
      monthlyPerformance: {
        month1: 82,
        month2: 80,
        month3: 78
      }
    },
    {
      id: 3,
      name: "مادة الرياضيات",
      instructor: "أ. أحمد",
      packageId: 135,
      rating: "جيد جدا",
      progress: 85,
      trend: "up",
      trendText: "أداؤك هذا الفصل أفضل من الفصل الماضي",
      hasComments: false,
      monthlyPerformance: {
        month1: 80,
        month2: 83,
        month3: 85
      }
    },
    {
      id: 4,
      name: "مادة العلوم",
      instructor: "أ. فاطمة",
      packageId: 193,
      rating: "يحتاج تحسين",
      progress: 48,
      trend: "down",
      trendText: "أداؤك هذا الفصل أقل من الفصل الماضي",
      hasComments: true,
      monthlyPerformance: {
        month1: 52,
        month2: 50,
        month3: 48
      }
    },
  ];

  const getSubjectsByPeriod = (period) => {
    switch (period) {
      case "month":
        return monthlySubjects;
      case "quarter":
        return quarterlySubjects;
      default:
        return monthlySubjects;
    }
  };

  const getOverallPerformanceByPeriod = (period) => {
    const performances = {
      month: { percentage: 85.2, rating: "جيد جدا" },
      quarter: { percentage: 83.8, rating: "جيد جدا" }
    };
    return performances[period] || performances.month;
  };

  const subjects = getSubjectsByPeriod(selectedPeriod);
  const overallPerformance = getOverallPerformanceByPeriod(selectedPeriod);
  // Only apply scroll margin on mobile when there are more than 2 subjects
  // On desktop (md+), we can fit more subjects without scroll
  const hasScroll = subjects.length > 2;

  return (
    <main className="min-h-svh bg-white flex flex-col">
      <Header title="تقاريري" onBack="/profile" />       
      <div className="relative flex-1 px-4 sm:px-8 lg:px-20 py-4 md:py-10 space-y-10 mx-auto w-full">
        
        {/* Period Selection */}
        <div>
          <PeriodDropdown 
            selectedPeriod={selectedPeriod} 
            onPeriodChange={setSelectedPeriod} 
          />
        </div>

        {/* Subject Performance Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
          hasScroll ? 'max-h-[502px] overflow-y-auto custom-scrollbar-2' : ''
        }`}>
          {subjects.map((subject) => (
            <SubjectCard 
              key={subject.id} 
              subject={subject} 
              period={selectedPeriod}
              hasScroll={hasScroll}
            />
          ))}
        </div>

        {/* Overall Performance Summary */}
        <PerformanceChart 
          percentage={overallPerformance.percentage}
          rating={overallPerformance.rating}
        />
        
      </div>
    </main>
  );
};

export default Reports;
