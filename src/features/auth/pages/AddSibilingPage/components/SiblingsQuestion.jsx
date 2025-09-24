import React from "react";
import { Link } from "react-router-dom";

const SiblingsQuestion = ({ hasSiblings, onChoice }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <h2 className="text-navyteal text-lg sm:text-xl font-semibold [font-family:'Cairo',Helvetica]">
          هل لديك اخوة ؟
        </h2>
        <p className="text-status text-sm sm:text-base [font-family:'Cairo',Helvetica]">
          اخبرنا اذا كان لديك اخوة لتضيفهم الى حسابك
        </p>
      </div>

      <div className="flex items-stretch gap-3">
        <button
          className={`flex-1 py-3 rounded-xl border transition-colors [font-family:'Cairo',Helvetica] ${
            hasSiblings === true
              ? "bg-orange-50 border-orange-500 text-orange-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => onChoice(true)}
        >
          نعم
        </button>
        <Link
          className={`flex-1 py-3 rounded-xl border text-center transition-colors [font-family:'Cairo',Helvetica] ${
            hasSiblings === false
              ? "bg-gray-100 border-gray-400 text-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => onChoice(false)}
          to="/main-packages"
        >
          لا
        </Link>
      </div>
    </div>
  );
};

export default SiblingsQuestion;
