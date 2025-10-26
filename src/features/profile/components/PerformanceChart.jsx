import reportsDolphin from "@/assets/images/reports-dolphin.svg";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PerformanceChart = ({ percentage, rating }) => {
  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ['#E89B32', '#E89B3244'],
        borderWidth: 0,
        cutout: '85%',
        borderRadius: percentage > 0 ? [8, 0] : [0, 0],
        borderSkipped: false,
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
        enabled: false,
      },
    },
  };

  const getPerformanceConfig = (rating) => {
    const configs = {
      "ممتاز": { color: "bg-[#27C840]" },
      "جيد جدا": { color: "bg-[#27C840]" },
      "جيد": { color: "bg-[#27C840]" },
      "مقبول": { color: "bg-orangedeep" },
      "يحتاج تحسين": { color: "bg-[#7A8085]" }
    };
    return configs[rating] || configs["مقبول"];
  };

  const performanceConfig = getPerformanceConfig(rating);

  return (
    <div className="border border-[#E8E8E8] rounded-xl p-6">
      <div className="flex items-center justify-between">
        {/* Illustration */}
        <div className="w-32 md:w-40 lg:w-50">
          <img src={reportsDolphin} alt="reports-dolphin" className="w-full h-full" />
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <h3 className="text-orangedeep text-sm md:text-base lg:text-xl font-semibold mb-2">متوسط الأداء</h3>
          
          {/* Chart */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-orangedeep text-lg font-bold">{percentage}%</span>
            </div>
          </div>
          
          <div>
            <span className={`px-6 md:px-10 py-1 rounded-full text-white text-sm font-medium min-w-[80px] md:min-w-[120px] text-center ${performanceConfig.color}`}>
              {rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
