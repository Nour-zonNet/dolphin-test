// import { useState } from "react";
// import { Line } from 'react-chartjs-2';
// import { X } from "lucide-react";
// import { ChevronDown } from "@/utils/icons";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const PerformanceChartModal = ({ subject, period, onClose }) => {
//   const [selectedPeriod, setSelectedPeriod] = useState(period || "month");

//   // Performance levels configuration matching the image
//   const performanceLevels = [
//     { label: "ممتاز", value: 100 },
//     { label: "جيد جدا", value: 80 },
//     { label: "جيد", value: 60 },
//     { label: "مقبول", value: 40 },
//     { label: "يحتاج تحسين", value: 20 }
//   ];                                                

//   // Get chart data based on period
//   const getChartData = () => {
//     if (selectedPeriod === "month") {
//       // Use weeklyComparison if available, otherwise use mock data
//       if (subject.weeklyComparison) {
//         const weeks = ["الاسبوع الرابع", "الاسبوع الثالث", "الاسبوع الثاني", "الاسبوع الاول"];
//         const values = [
//           subject.weeklyComparison.week4,
//           subject.weeklyComparison.week3,
//           subject.weeklyComparison.week2,
//           subject.weeklyComparison.week1
//         ];
//         return { labels: weeks, data: values };
//       } else {
//         // Mock data for monthly view
//         const weeks = ["الاسبوع الرابع", "الاسبوع الثالث", "الاسبوع الثاني", "الاسبوع الاول"];
//         const values = [85, 78, 92, 88];
//         return { labels: weeks, data: values };
//       }
//     } else if (selectedPeriod === "quarter") {
//       // Use monthlyPerformance if available, otherwise use mock data
//       if (subject.monthlyPerformance) {
//         const months = ["الشهر الثالث", "الشهر الثاني", "الشهر الاول"];
//         const values = [
//           subject.monthlyPerformance.month3,
//           subject.monthlyPerformance.month2,
//           subject.monthlyPerformance.month1
//         ];
//         return { labels: months, data: values };
//       } else {
//         // Mock data for quarterly view
//         const months = ["الشهر الثالث", "الشهر الثاني", "الشهر الاول"];
//         const values = [82, 75, 89];
//         return { labels: months, data: values };
//       }
//     }
//     return { labels: [], data: [] };
//   };

//   const chartData = getChartData();

//   const data = {
//     labels: chartData.labels,
//     datasets: [
//       {
//         label: 'الأداء',
//         data: chartData.data,
//         borderColor: '#0077B6', 
//         backgroundColor: 'rgba(0, 119, 182, 0.1)',
//         borderWidth: 3,
//         pointBackgroundColor: '#0077B6',
//         pointBorderColor: '#0077B6',
//         pointRadius: 6,
//         pointHoverRadius: 8,
//         pointHoverBackgroundColor: '#0077B6',
//         pointHoverBorderColor: '#0077B6',
//         fill: false, 
//         tension: 0.2,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         titleColor: 'white',
//         bodyColor: 'white',
//         borderColor: '#0077B6',
//         borderWidth: 1,
//         callbacks: {
//           label: function(context) {
//             return `${context.parsed.y}%`;
//           }
//         }
//       },
//     },
//     scales: {
//       x: {
//         display: true,
//         position: 'bottom',
//         grid: {
//           display: false,
//         },
//         ticks: {
//           color: '#374151',
//           font: {
//             size: 12,
//             weight: '500',
//           },
//           maxRotation: 0, 
//           minRotation: 15,
//         },
//       },
//       y: {
//         display: true,
//         position: 'right',
//         min: 0,
//         max: 100,
//         grid: {
//           color: '#E5E7EB',
//           lineWidth: 1,
//           drawBorder: false,
//           drawTicks: false,
//         },
//         ticks: {
//           color: '#374151',
//           font: {
//             size: 12,
//             weight: '500',
//           },
//           callback: function(value) {
//             const level = performanceLevels.find(level => level.value === value);
//             return level ? level.label : '';
//           },
//           stepSize: 20, // Show only the performance level values
//         },
//       },
//     },
//   };

 

//   return (
//     <div className="bg-white rounded-xl p-6 w-full md:min-w-xl xl:min-w-2xl max-w-2xl mx-auto">
//       {/* Header */}
//       <div className="relative flex items-center justify-between mb-6">
//         <button
//           onClick={onClose}
//           className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
//         >
//           <X className="w-5 h-5 text-navyteal" />
//         </button>
//         <div className="text-center flex-1 absolute left-1/2 -translate-x-1/2">
//           <h2 className="text-xl font-semibold text-navyteal mb-2">
//             مقارنة الاداء
//           </h2>
//           <p className="text-sm text-[#525D67] text-nowrap">
//             مقارنة تفصيلية لأدائك في الفترات المختلفة
//           </p>
//         </div>
//       </div>

//     {/* Separator */}
//     <div className="border-t border-dashed border-gray-300 mb-4"></div>

//     {/* Period Selector */}
//     <div className="mb-6">
//       <div className="relative">
//         <select
//           value={selectedPeriod}
//           onChange={(e) => setSelectedPeriod(e.target.value)}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orangedeep focus:border-transparent text-center"
//         >
//           <option value="month">شهري</option>
//           <option value="quarter">فصلي</option>
//         </select>
//         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//           <ChevronDown className="w-4 h-4 text-navyteal" />
//         </div>
//       </div>
//     </div>

//       {/* Chart */}
//       <div className="h-80">
//         <Line data={data} options={options} />
//       </div>
//     </div>
//   );
// };

// export default PerformanceChartModal;
import { useState, useMemo } from "react";
import { Line } from 'react-chartjs-2';
import { X } from "lucide-react";
import { ChevronDown } from "@/utils/icons";
import ModalContainer from "../ModalContainer";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PerformanceChartModal = ({ subject, period, onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(period || "month");

  // Debug: Log the subject data to see what we're receiving
  console.log("PerformanceChartModal - Subject data:", subject);
  console.log("PerformanceChartModal - API data:", subject?.apiData);

  // Performance levels configuration matching the image
  const performanceLevels = [
    { label: "ممتاز", value: 100 },
    { label: "جيد جدا", value: 80 },
    { label: "جيد", value: 60 },
    { label: "مقبول", value: 40 },
    { label: "يحتاج تحسين", value: 20 }
  ];                                                

  // Helper function to get week number in month
  const getWeekNumber = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const offsetDate = date.getDate() + firstDay - 1;
    return Math.floor(offsetDate / 7) + 1;
  };

  // Helper function to get Arabic month name
  const getMonthName = (date) => {
    const months = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    return months[date.getMonth()];
  };

  // Group reviews by week and calculate average ratings
  const groupByWeek = (reviews) => {
    const weeks = {};
    
    reviews.forEach(review => {
      const date = new Date(review.created_at);
      const weekNumber = getWeekNumber(date);
      const weekKey = `week${weekNumber}`;
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          total: 0,
          count: 0,
          dates: []
        };
      }
      
      weeks[weekKey].total += review.rating;
      weeks[weekKey].count += 1;
      weeks[weekKey].dates.push(review.created_at);
    });

    // Calculate averages and prepare data
    const weekLabels = ["الاسبوع الاول", "الاسبوع الثاني", "الاسبوع الثالث", "الاسبوع الرابع"];
    const weekData = [0, 0, 0, 0];
    
    Object.keys(weeks).forEach(weekKey => {
      const weekIndex = parseInt(weekKey.replace('week', '')) - 1;
      if (weekIndex >= 0 && weekIndex < 4) {
        const average = (weeks[weekKey].total / weeks[weekKey].count) * 20;
        weekData[weekIndex] = Math.round(average);
      }
    });

    // Fill empty weeks with previous data or default
    for (let i = 1; i < 4; i++) {
      if (weekData[i] === 0 && weekData[i - 1] > 0) {
        weekData[i] = weekData[i - 1];
      }
    }

    console.log("Weekly chart data:", { labels: weekLabels, data: weekData });
    return { labels: weekLabels, data: weekData };
  };

  // Group reviews by month and calculate average ratings
  const groupByMonth = (reviews) => {
    const months = {};
    
    reviews.forEach(review => {
      const date = new Date(review.created_at);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!months[monthKey]) {
        months[monthKey] = {
          total: 0,
          count: 0,
          monthName: getMonthName(date),
          order: date.getTime()
        };
      }
      
      months[monthKey].total += review.rating;
      months[monthKey].count += 1;
    });

    // Sort by date and get last 3 months
    const sortedMonths = Object.values(months)
      .sort((a, b) => b.order - a.order)
      .slice(0, 3);

    const monthLabels = sortedMonths.map(month => month.monthName).reverse();
    const monthData = sortedMonths.map(month => 
      Math.round((month.total / month.count) * 20) // Convert 5-star to percentage
    ).reverse();

    // If we have less than 3 months, fill with previous data
    while (monthLabels.length < 3) {
      monthLabels.unshift(`الشهر ${3 - monthLabels.length}`);
      monthData.unshift(monthData[0] || 0);
    }

    console.log("Monthly chart data:", { labels: monthLabels, data: monthData });
    return { labels: monthLabels, data: monthData };
  };

  // Transform API data to chart format based on selected period
  const transformChartData = useMemo(() => {
    console.log("Transforming chart data...");
    
    // Get reviews from API data
    const reviews = subject?.apiData?.reviews || [];
    console.log("Found reviews for chart:", reviews);
    
    if (reviews.length === 0) {
      console.log("No reviews found for chart data");
      return { labels: [], data: [] };
    }

    // Filter reviews based on selected period
    const filteredReviews = reviews.filter(review => {
      if (!review.created_at) return false;
      
      if (selectedPeriod === "month") {
        // For monthly, show recent reviews (last 30 days)
        try {
          const reviewDate = new Date(review.created_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return reviewDate >= thirtyDaysAgo;
        } catch (error) {
          return false;
        }
      } else {
        // For semesterly, show all reviews
        return true;
      }
    });

    console.log("Filtered reviews for chart:", filteredReviews);

    // Group and aggregate data based on period
    if (selectedPeriod === "month") {
      // Group by week for monthly view
      const weeklyData = groupByWeek(filteredReviews);
      return weeklyData;
    } else {
      // Group by month for semesterly view
      const monthlyData = groupByMonth(filteredReviews);
      return monthlyData;
    }
  }, [subject, selectedPeriod]);

  const chartData = transformChartData;

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'الأداء',
        data: chartData.data,
        borderColor: '#0077B6', 
        backgroundColor: 'rgba(0, 119, 182, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#0077B6',
        pointBorderColor: '#0077B6',
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#0077B6',
        pointHoverBorderColor: '#0077B6',
        pointHitRadius: 10, // Increases the interactive area
        pointHoverBorderWidth: 3, 
        fill: true,
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#0077B6',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y}%`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        position: 'bottom',
        grid: {
          display: false,
        },
        ticks: {
          color: '#374151',
          font: {
            size: 12,
            weight: '500',
          },
          maxRotation: 0, 
          minRotation: 15,
        },
      },
      y: {
        display: true,
        position: 'right',
        // min: 0,
        // max: 100,
        suggestedMin: 0,
        suggestedMax: 100,
        grace: '5%',
        grid: {
          color: '#E5E7EB',
          lineWidth: 1,
          drawBorder: false,
          drawTicks: false,
        },
        ticks: {
          color: '#374151',
          font: {
            size: 12,
            weight: '500',
          },
          callback: function(value) {
            const level = performanceLevels.find(level => level.value === value);
            return level ? level.label : '';
          },
          stepSize: 20,
        },
      },
    },
  };

  const subjectName = subject?.name || subject?.apiData?.subject?.name || "المادة";

  return (
    <ModalContainer onClose={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full md:min-w-xl xl:min-w-2xl md:max-w-xl mx-auto max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-navyteal" />
          </button>
          <h2 className="text-sm md:text-xl font-semibold text-navyteal text-center absolute left-1/2 -translate-x-1/2">
            مقارنة الأداء - {subjectName}
          </h2>
        </div>

        {/* Separator */}
        <div className="border-t border-dashed border-gray-300 mb-4"></div>

        {/* Period Selector */}
        <div className="mb-6">
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-3 pr-4 pl-10 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orangedeep focus:border-transparent text-center"
            >
              <option value="month">شهري</option>
              <option value="quarter">فصلي</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-navyteal" />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-4 flex items-center justify-between text-sm text-navyteal bg-gray-50 p-3 rounded-lg">
          <span>
            إجمالي التقييمات: <strong>{subject?.apiData?.reviews?.length || 0}</strong>
          </span>
          <span>
            متوسط التقييم: <strong>
              {subject?.apiData?.reviews?.length ? 
                Math.round((subject.apiData.reviews.reduce((sum, review) => sum + review.rating, 0) / subject.apiData.reviews.length) * 20) + '%' 
                : '0%'
              }
            </strong>
          </span>
        </div>

        <div className="h-70"> 
          {chartData.data.length > 0 ? (
            <Line data={data} options={options} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">لا توجد بيانات كافية</p>
                <p className="text-sm">تقييمات غير كافية لعرض مخطط الأداء</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalContainer>
  );
};

export default PerformanceChartModal;