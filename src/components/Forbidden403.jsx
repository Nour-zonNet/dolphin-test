import React from 'react';
import forbiddenImage from '@/assets/images/error403.png';
import { Home } from '@/utils/icons';

const Forbidden403 = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 md:px-8">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-center w-full">
        {/* Illustration Image */}
        <div className="mb-8 w-full max-w-md">
          <img 
            src={forbiddenImage} 
            alt="403 Forbidden" 
            className="w-[60%] md:w-[75%] lg:w-full h-auto mx-auto"
          />
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <p className="text-base md:text-2xl lg:text-3xl text-navyteal font-bold">
            عذراً! لا تملك الصلاحية للوصول إلى هذه الصفحة.
          </p>
        </div>

        {/* Go Home Button */}
        <button 
          onClick={handleGoHome}
          className="bg-[#D18C2D] hover:bg-btnClicked text-navyteal rounded-full px-8 md:px-12 py-3 md:py-4 lg:mt-8 text-base md:text-lg font-semibold cursor-pointer flex items-center gap-2 transition-colors duration-200 w-[80%] md:w-[50%] lg:w-[35%] justify-center"
        >
          <Home />
          <span className="text-navyteal">العودة للرئيسية</span>
        </button>
      </div>
    </div>
  );
};

export default Forbidden403;

