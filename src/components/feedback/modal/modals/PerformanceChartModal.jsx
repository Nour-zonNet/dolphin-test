import { useState, useEffect } from "react";
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
import api from "@/services/api";

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
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get subject ID from the passed data
  const subjectId = subject?.apiData?.subject?.id || subject?.id;

  // Debug: Log the subject data to see what we're receiving
  console.log("PerformanceChartModal - Subject data:", subject);
  console.log("PerformanceChartModal - API data:", subject?.apiData);
  console.log("PerformanceChartModal - Subject ID:", subjectId);

  // Performance levels configuration matching the image
  const performanceLevels = [
    { label: "ممتاز", value: 100 },
    { label: "جيد جدا", value: 80 },
    { label: "جيد", value: 60 },
    { label: "مقبول", value: 40 },
    { label: "يحتاج تحسين", value: 20 }
  ];                                                

  // Fetch chart data from API
  useEffect(() => {
    const fetchChartData = async () => {
      if (!subjectId) {
        console.log("No subject ID available");
        setChartData({ labels: [], data: [] });
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Map selectedPeriod to API type
        // "month" -> "week" (weekly data for monthly view)
        // "quarter" -> "month" (monthly data for semester/quarter view)
        const apiType = selectedPeriod === "month" ? "week" : "month";
        
        console.log(`Fetching chart data for subject ${subjectId} with type: ${apiType}`);
        
        const response = await api.request({
          method: 'GET',
          url: `/student/review/chart/${subjectId}`,
          data: { type: apiType }
        });

        console.log("Chart API response:", response.data);
        
        // Assuming the API returns data in format: { labels: [], data: [] }
        if (response.data && response.data.labels && response.data.data) {
          setChartData({
            labels: response.data.labels,
            data: response.data.data
          });
        } else {
          setChartData({ labels: [], data: [] });
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError(err.response?.data?.message || "فشل في تحميل بيانات المخطط");
        setChartData({ labels: [], data: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [subjectId, selectedPeriod]);

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
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">جاري التحميل...</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-red-500">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">خطأ في التحميل</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : chartData.data.length > 0 ? (
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