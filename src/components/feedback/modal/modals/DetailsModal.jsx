import { Cross, Info } from "../../../../utils/icons";

const DetailsModal = ({ onClose, packageDetails = {} }) => {
  const {
    name = "مادة الصحة العامة",
    description = "تهدف هذه المادة إلى تعريف الطالب بأساسيات الوقاية من الأمراض وأهمية اتباع أنماط الحياة الصحية السليمة كما تسلط الضوء على دور التغذية والصحة البيئية والتوعية المجتمعية في تعزيز صحة الفرد والمجتمع. ويتعرف الطالب كذلك على أهمية أنظمة الرعاية الصحية ودورها في حياتنا اليومية.",
  } = packageDetails;

  return (
    <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-lg mx-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
      >
        <Cross width="14" height="14" />
      </button>

      {/* Header */}
      <div className="text-center mb-6 space-y-3">
        <div className="flex justify-center">
          <Info />
        </div>
        <h2 className="text-lg font-bold text-navyteal  mb-2">تفاصيل الباقة</h2>
      </div>
      <hr className="border-t border-dashed border-subtext/50 mb-6" />
      {/* Package Name */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-cairo mb-3">
          {name}
        </h3>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-gray-700 text-base leading-relaxed font-cairo ">
          {description}
        </p>
      </div>

      {/* Additional Info Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2 font-cairo">
          معلومات إضافية:
        </h4>
        <ul className="space-y-2 text-sm text-gray-600 font-cairo">
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>مدة الباقة: 30 يوم</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>عدد الدروس: 12 درس</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>مستوى الصعوبة: مبتدئ</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailsModal;
