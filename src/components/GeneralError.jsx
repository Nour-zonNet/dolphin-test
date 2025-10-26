import React from 'react';
import generalErrorImage from '@/assets/images/error.png';
import sendIcon from '@/assets/images/send-rate-icon.svg';
import { Retry } from '@/utils/icons';

const GeneralError = ({ onRetry }) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleContactSupport = () => {
    // Open support chat if available
    if (window.$chatwoot) {
      window.$chatwoot.toggle();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 md:px-8">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-center w-full">
        {/* Illustration Image */}
        <div className="mb-8 w-full max-w-md">
          <img 
            src={generalErrorImage} 
            alt="General Error" 
            className="w-[60%] md:w-[75%] lg:w-full h-auto mx-auto"
          />
        </div>

        {/* Error Messages */}
        <div className="mb-8">
          <h2 className="text-base md:text-2xl lg:text-3xl font-bold text-navyteal mb-3">
            عذرا, حدث خطأ ما
          </h2>
          <p className="text-sm md:text-xl text-navyteal">
            يرجي المجاولة مرة اخري في وقت لاحق
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-[80%]">
          {/* Secondary Action Button (Left) - Send to Support */}
          <button 
            onClick={handleContactSupport}
            className="bg-white border-2 border-[#D18C2D] w-full text-navyteal hover:bg-[#D18C2D] hover:text-navyteal rounded-full px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200"
          >
            <img src={sendIcon} alt="send icon" className="w-5 h-5 md:w-6 md:h-6" />
            <span>ارسال للدعم الفني</span>
          </button>

          {/* Primary Action Button (Right) - Try Again */}
          <button 
            onClick={handleRetry}
            className="bg-[#D18C2D] hover:bg-btnClicked w-full text-navyteal rounded-full px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <Retry className="w-5 h-5 md:w-6 md:h-6" />
            <span>حاول مرة أخرى</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralError;

