import React from 'react';
import { useNavigate } from "react-router-dom";
import { ExclamationMark, Plus } from '../../../utils/icons';
export const ActionButtons = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center flex-col md:flex-row justify-between gap-4 w-[100%]">
      <button className="bg-orangedeep w-full md:w-1/2 md:py-4 py-3 rounded-4xl flex items-center justify-center gap-2 cursor-pointer" onClick={() => navigate("")}>
        <Plus className="w-4 md:w-6" />
        <p className="font-semibold text-navyteal md:text-2xl text-sm">
          اضافة باقة جديدة
        </p>
      </button>

      <button className="border border-orangedeep focus:bg-orangedeep hover:bg-orangedeep transition w-full md:w-1/2 md:py-4 py-3 rounded-4xl flex items-center justify-center gap-2 cursor-pointer">
        <ExclamationMark className="w-4 md:w-6" />
        <p className="font-semibold text-navyteal md:text-2xl text-sm">
          تفاصيل الباقات
        </p>
      </button>
    </div>
  );
};

export default ActionButtons