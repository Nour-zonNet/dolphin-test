import React from 'react';
import { useTranslation } from 'react-i18next';
import maintenanceDolphin from '@/assets/images/maintenance-dolphin.webp';
import { LeftArrowFilled } from '@/utils/icons';
import HomeSupportBtn from './layout/HomeSupportBtn';

const MaintenanceScreen = ({ onGoHome }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex flex-col" dir="rtl">
      {/* Header with Logo */}
      <div className="flex items-center ps-8 pt-6">
        <div className="flex items-center gap-2">
          <img 
            src="/dolphinLogo.png" 
            alt="Dolphin Logo" 
            className="h-12 sm:h-16 md:h-20 w-auto object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Maintenance Dolphin Character */}
        <div className="mb-8">
          <img 
            src={maintenanceDolphin} 
            alt="Maintenance Dolphin" 
            className="w-32 h-auto max-w-full md:w-56"
          />
        </div>

        {/* Maintenance Messages */}
        <div className="mb-8 max-w-md">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-[#155274] mb-4 leading-tight">
            {t('maintenance.title', 'الموقع تحت الصيانة')}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-[#155274] leading-relaxed">
            {t('maintenance.description', 'نقوم حالياً بأعمال تطوير وصيانة لتحسين تجربتك')}
          </p>
        </div>

        {/* Go Home Button */}
        <button 
          className="bg-orangedeep hover:bg-btnClicked border-none rounded-full px-8 py-3 md:py-4 text-base md:text-lg font-semibold cursor-pointer flex items-center gap-2 transition-colors duration-200 w-full lg:w-[50%] justify-center"
          onClick={onGoHome}
        >
          <LeftArrowFilled className="w-5 h-5" />
          <span className="text-navyteal">{t('maintenance.goHome', 'العودة للرئيسية')}</span>
        </button>
      </div>

      {/* Support Chat Icon */}
        <HomeSupportBtn />
    </div>
  );
};

export default MaintenanceScreen;
