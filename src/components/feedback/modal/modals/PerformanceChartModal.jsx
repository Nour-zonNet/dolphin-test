import { useState } from "react";
import { Line } from 'react-chartjs-2';
import { X } from "lucide-react";
import { ChevronDown } from "@/utils/icons";
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

  // Performance levels configuration matching the image
  const performanceLevels = [
    { label: "ممتاز", value: 100 },
    { label: "جيد جدا", value: 80 },
    { label: "جيد", value: 60 },
    { label: "مقبول", value: 40 },
    { label: "يحتاج تحسين", value: 20 }
  ];

  // Get chart data based on period
  const getChartData = () => {
    if (selectedPeriod === "month") {
      // Use weeklyComparison if available, otherwise use mock data
      if (subject.weeklyComparison) {
        const weeks = ["الاسبوع الرابع", "الاسبوع الثالث", "الاسبوع الثاني", "الاسبوع الاول"];
        const values = [
          subject.weeklyComparison.week4,
          subject.weeklyComparison.week3,
          subject.weeklyComparison.week2,
          subject.weeklyComparison.week1
        ];
        return { labels: weeks, data: values };
      } else {
        // Mock data for monthly view
        const weeks = ["الاسبوع الرابع", "الاسبوع الثالث", "الاسبوع الثاني", "الاسبوع الاول"];
        const values = [85, 78, 92, 88];
        return { labels: weeks, data: values };
      }
    } else if (selectedPeriod === "quarter") {
      // Use monthlyPerformance if available, otherwise use mock data
      if (subject.monthlyPerformance) {
        const months = ["الشهر الثالث", "الشهر الثاني", "الشهر الاول"];
        const values = [
          subject.monthlyPerformance.month3,
          subject.monthlyPerformance.month2,
          subject.monthlyPerformance.month1
        ];
        return { labels: months, data: values };
      } else {
        // Mock data for quarterly view
        const months = ["الشهر الثالث", "الشهر الثاني", "الشهر الاول"];
        const values = [82, 75, 89];
        return { labels: months, data: values };
      }
    }
    return { labels: [], data: [] };
  };

  const chartData = getChartData();

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
        fill: false, 
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        min: 0,
        max: 100,
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
          stepSize: 20, // Show only the performance level values
        },
      },
    },
  };

  const getPeriodText = (period) => {
    return period === "month" ? "شهري" : "فصلي";
  };

  return (
    <div className="bg-white rounded-xl p-6 w-full md:min-w-xl xl:min-w-2xl max-w-2xl mx-auto">
      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-navyteal" />
        </button>
        <div className="text-center flex-1 absolute left-1/2 -translate-x-1/2">
          <h2 className="text-xl font-semibold text-navyteal mb-2">
            مقارنة الاداء
          </h2>
          <p className="text-sm text-[#525D67] text-nowrap">
            مقارنة تفصيلية لأدائك في الفترات المختلفة
          </p>
        </div>
      </div>

    {/* Separator */}
    <div className="border-t border-dashed border-gray-300 mb-4"></div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orangedeep focus:border-transparent text-center"
          >
            <option value="month">شهري</option>
            <option value="quarter">فصلي</option>
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-navyteal" />
        </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default PerformanceChartModal;
