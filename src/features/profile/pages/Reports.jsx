
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
      <main className="sm:min-h-svh bg-white flex flex-col">
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
            overallData={reportsData}
          />
        )}
        
      </div>
    </main>
  );
};

export default Reports;