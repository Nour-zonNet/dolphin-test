// import { Header } from "@/components";
// import { useState } from "react";
// import { PeriodDropdown, SubjectCard, PerformanceChart } from "../components";
// // import { packageStyles } from "@/constants/PACKAGE_COLORS";

// const Reports = () => {
//   const [selectedPeriod, setSelectedPeriod] = useState("month");

//   // Monthly data - comparing weeks within the month
//   const monthlySubjects = [
//     {
//       id: 1,
//       name: "مادة الصحة العامة",
//       instructor: "أ. حنان",
//       packageId: 114,
//       rating: "ممتاز",
//       progress: 95,
//       trend: "up",
//       trendText: "أداؤك هذا الشهر أفضل من الشهر الماضي",
//       hasComments: false,
//       weeklyComparison: {
//         week1: 85,
//         week2: 90,
//         week3: 92,
//         week4: 95
//       }
//     },
//     {
//       id: 2,
//       name: "مادة ركن المسلم",
//       instructor: "أ. حنان",
//       packageId: 162,
//       rating: "جيد",
//       progress: 75,
//       trend: "down",
//       trendText: "أداؤك هذا الشهر أقل من الشهر الماضي",
//       hasComments: true,
//       weeklyComparison: {
//         week1: 80,
//         week2: 78,
//         week3: 76,
//         week4: 75
//       }
//     },
//     {
//       id: 3,
//       name: "مادة الرياضيات",
//       instructor: "أ. أحمد",
//       packageId: 135,
//       rating: "جيد جدا",
//       progress: 88,
//       trend: "up",
//       trendText: "أداؤك هذا الشهر أفضل من الشهر الماضي",
//       hasComments: false,
//       weeklyComparison: {
//         week1: 82,
//         week2: 85,
//         week3: 87,
//         week4: 88
//       }
//     },
//     {
//       id: 4,
//       name: "مادة العلوم",
//       instructor: "أ. فاطمة",
//       packageId: 193,
//       rating: "يحتاج تحسين",
//       progress: 45,
//       trend: "down",
//       trendText: "أداؤك هذا الشهر أقل من الشهر الماضي",
//       hasComments: true,
//       weeklyComparison: {
//         week1: 50,
//         week2: 48,
//         week3: 46,
//         week4: 45
//       }
//     },
    
//   ];

//   // Quarterly data - 3 months performance
//   const quarterlySubjects = [
//     {
//       id: 1,
//       name: "مادة الصحة العامة",
//       instructor: "أ. حنان",
//       packageId: 113,
//       rating: "ممتاز",
//       progress: 92,
//       trend: "up",
//       trendText: "أداؤك هذا الفصل أفضل من الفصل الماضي",
//       hasComments: false,
//       monthlyPerformance: {
//         month1: 88,
//         month2: 90,
//         month3: 92
//       }
//     },
//     {
//       id: 2,
//       name: "مادة ركن المسلم",
//       instructor: "أ. حنان",
//       packageId: 162,
//       rating: "جيد",
//       progress: 78,
//       trend: "down",
//       trendText: "أداؤك هذا الفصل أقل من الفصل الماضي",
//       hasComments: true,
//       monthlyPerformance: {
//         month1: 82,
//         month2: 80,
//         month3: 78
//       }
//     },
//     {
//       id: 3,
//       name: "مادة الرياضيات",
//       instructor: "أ. أحمد",
//       packageId: 135,
//       rating: "جيد جدا",
//       progress: 85,
//       trend: "up",
//       trendText: "أداؤك هذا الفصل أفضل من الفصل الماضي",
//       hasComments: false,
//       monthlyPerformance: {
//         month1: 80,
//         month2: 83,
//         month3: 85
//       }
//     },
//     {
//       id: 4,
//       name: "مادة العلوم",
//       instructor: "أ. فاطمة",
//       packageId: 193,
//       rating: "يحتاج تحسين",
//       progress: 48,
//       trend: "down",
//       trendText: "أداؤك هذا الفصل أقل من الفصل الماضي",
//       hasComments: true,
//       monthlyPerformance: {
//         month1: 52,
//         month2: 50,
//         month3: 48
//       }
//     },
//   ];

//   const getSubjectsByPeriod = (period) => {
//     switch (period) {
//       case "month":
//         return monthlySubjects;
//       case "quarter":
//         return quarterlySubjects;
//       default:
//         return monthlySubjects;
//     }
//   };

//   const getOverallPerformanceByPeriod = (period) => {
//     const performances = {
//       month: { percentage: 85.2, rating: "جيد جدا" },
//       quarter: { percentage: 83.8, rating: "جيد جدا" }
//     };
//     return performances[period] || performances.month;
//   };

//   const subjects = getSubjectsByPeriod(selectedPeriod);
//   const overallPerformance = getOverallPerformanceByPeriod(selectedPeriod);
//   // Only apply scroll margin on mobile when there are more than 2 subjects
//   // On desktop (md+), we can fit more subjects without scroll
//   const hasScroll = subjects.length > 2;

//   return (
//     <main className="min-h-svh bg-white flex flex-col">
//       <Header title="تقاريري" onBack="/profile" />       
//       <div className="relative flex-1 px-4 sm:px-8 lg:px-20 py-4 md:py-10 space-y-10 mx-auto w-full">
        
//         {/* Period Selection */}
//         <div>
//           <PeriodDropdown 
//             selectedPeriod={selectedPeriod} 
//             onPeriodChange={setSelectedPeriod} 
//           />
//         </div>

//         {/* Subject Performance Cards */}
//         <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
//           hasScroll ? 'max-h-[502px] overflow-y-auto custom-scrollbar-2' : ''
//         }`}>
//           {subjects.map((subject) => (
//             <SubjectCard 
//               key={subject.id} 
//               subject={subject} 
//               period={selectedPeriod}
//               hasScroll={hasScroll}
//             />
//           ))}
//         </div>

//         {/* Overall Performance Summary */}
//         <PerformanceChart 
//           percentage={overallPerformance.percentage}
//           rating={overallPerformance.rating}
//         />
        
//       </div>
//     </main>
//   );
// };

// export default Reports;

// components/Reports.js
import { Header } from "@/components";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PeriodDropdown, SubjectCard, PerformanceChart } from "../components";
import { fetchStudentReports, setFilter } from "@/store/studentReportsSlice";

const Reports = () => {
  const dispatch = useDispatch();
  const { data: reportsData, loading, error, filter } = useSelector(state => state.studentReports);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Map API filter values to component period values
  const filterMap = {
    'month': 'monthly',
    'quarter': 'semestery'
  };

  const periodMap = {
    'monthly': 'month',
    'semestery': 'quarter'
  };

  // Fetch data when component mounts or filter changes
  useEffect(() => {
    const apiFilter = filterMap[selectedPeriod];
    dispatch(fetchStudentReports(apiFilter));
  }, [dispatch, selectedPeriod]);

  // Handle period change
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  // Transform API data to component format
  const transformSubjectsData = (apiData) => {
    if (!apiData?.subjects) return [];

    return apiData.subjects.map((subject, index) => {
      // Calculate average rating for the subject
      const totalRating = subject.reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = subject.reviews.length > 0 ? totalRating / subject.reviews.length : 0;
      
      // Determine rating category based on average
      const getRatingCategory = (rating) => {
        if (rating >= 4.5) return "ممتاز";
        if (rating >= 4) return "جيد جدا";
        if (rating >= 3) return "جيد";
        if (rating >= 2) return "مقبول";
        return "يحتاج تحسين";
      };

      // Get main teacher (first teacher in the array)
      const mainTeacher = subject.teachers[0]?.name || "مدرس غير معروف";

      // Generate trend data based on current vs previous period
      const currentAvg = subject.average_rating.current_period;
      const previousAvg = subject.average_rating.previous_period;
      const trend = currentAvg >= previousAvg ? "up" : "down";
      
      const trendText = currentAvg >= previousAvg 
        ? `أداؤك هذا ${selectedPeriod === 'month' ? 'الشهر' : 'الفصل'} أفضل من ${selectedPeriod === 'month' ? 'الشهر' : 'الفصل'} الماضي`
        : `أداؤك هذا ${selectedPeriod === 'month' ? 'الشهر' : 'الفصل'} أقل من ${selectedPeriod === 'month' ? 'الشهر' : 'الفصل'} الماضي`;

      // Generate comparison data for charts
      const generateComparisonData = () => {
        if (selectedPeriod === 'month') {
          // For monthly view, simulate weekly data
          const baseValue = averageRating * 20; // Convert to percentage (5-star = 100%)
          return {
            week1: baseValue - 10,
            week2: baseValue - 5,
            week3: baseValue - 2,
            week4: baseValue
          };
        } else {
          // For quarterly view, simulate monthly data
          const baseValue = averageRating * 20;
          return {
            month1: baseValue - 8,
            month2: baseValue - 4,
            month3: baseValue
          };
        }
      };

      return {
        id: subject.subject?.id || index + 1,
        name: subject.subject?.name || "مادة غير معروفة",
        instructor: mainTeacher,
        packageId: 100 + index, // Default package IDs
        rating: getRatingCategory(averageRating),
        progress: Math.round(averageRating * 20), // Convert to percentage
        trend: trend,
        trendText: trendText,
        hasComments: subject.reviews.some(review => review.comment),
        // Include API data for modals
        apiData: subject,
        // Chart data
        ...(selectedPeriod === 'month' 
          ? { weeklyComparison: generateComparisonData() }
          : { monthlyPerformance: generateComparisonData() }
        )
      };
    });
  };

  const getOverallPerformanceByPeriod = () => {
    if (!reportsData) {
      return { percentage: 0, rating: "لا توجد بيانات" };
    }

    const overallAverage = reportsData.overall_student_average;
    const percentage = Math.round(overallAverage * 20); // Convert to percentage
    
    const getRatingCategory = (rating) => {
      if (rating >= 4.5) return "ممتاز";
      if (rating >= 4) return "جيد جدا";
      if (rating >= 3) return "جيد";
      if (rating >= 2) return "مقبول";
      return "يحتاج تحسين";
    };

    return {
      percentage: percentage,
      rating: getRatingCategory(overallAverage)
    };
  };

  const subjects = transformSubjectsData(reportsData);
  const overallPerformance = getOverallPerformanceByPeriod();

  // Only apply scroll margin on mobile when there are more than 2 subjects
  const hasScroll = subjects.length > 2;

  if (loading) {
    return (
      <main className="min-h-svh bg-white flex flex-col">
        <Header title="تقاريري" onBack="/profile" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orangedeep mx-auto"></div>
            <p className="mt-4 text-navyteal">جاري تحميل التقارير...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-svh bg-white flex flex-col">
        <Header title="تقاريري" onBack="/profile" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>حدث خطأ في تحميل التقارير</p>
            <button 
              onClick={() => dispatch(fetchStudentReports(filterMap[selectedPeriod]))}
              className="mt-4 px-6 py-2 bg-orangedeep text-white rounded-full hover:bg-btnClicked transition-colors"
            >
              حاول مرة أخرى
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-white flex flex-col">
      <Header title="تقاريري" onBack="/profile" />       
      <div className="relative flex-1 px-4 sm:px-8 lg:px-20 py-4 md:py-10 space-y-10 mx-auto w-full">
        
        {/* Period Selection */}
        <div>
          <PeriodDropdown 
            selectedPeriod={selectedPeriod} 
            onPeriodChange={handlePeriodChange} 
          />
        </div>

        {/* Subject Performance Cards */}
        {subjects.length > 0 ? (
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
        ) : (
          <div className="text-center py-10">
            <p className="text-navyteal">لا توجد تقارير متاحة</p>
          </div>
        )}

        {/* Overall Performance Summary */}
        {reportsData && (
          <PerformanceChart 
            percentage={overallPerformance.percentage}
            rating={overallPerformance.rating}
          />
        )}
        
      </div>
    </main>
  );
};

export default Reports;