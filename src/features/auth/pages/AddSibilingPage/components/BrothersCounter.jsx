import React from "react";

const BrothersCounter = ({ currentCount, maxCount = 3 }) => {
  const remaining = maxCount - currentCount;
  
  return (
    <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200 mb-4">
      <p className="text-blue-700 text-sm [font-family:'Cairo',Helvetica]">
        {remaining > 0 ? (
          <>يمكنك إضافة {remaining} إخوة آخرين (لديك {currentCount} من أصل {maxCount})</>
        ) : (
          <>لديك {currentCount} إخوة (الحد الأقصى)</>
        )}
      </p>
    </div>
  );
};

export default BrothersCounter;
