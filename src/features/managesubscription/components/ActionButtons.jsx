import React from 'react';
import { useNavigate } from "react-router-dom";
import { ExclamationMark, Plus } from '../../../utils/icons';
export const ActionButtons = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between gap-4 w-[100%] lg:px-20 px-4">
      <button className="bg-orangedeep w-1/2 py-4.5 rounded-4xl flex items-center justify-center gap-2 cursor-pointer" onClick={() => navigate("/select-packages")}>
        <Plus />
        <p className="font-semibold text-navyteal text-2xl">
          اضافة باقة جديدة
        </p>
      </button>

      <button className="border border-orangedeep focus:bg-orangedeep hover:bg-orangedeep transition w-1/2 py-4.5 rounded-4xl flex items-center justify-center gap-2 cursor-pointer">
        <ExclamationMark />
        <p className="font-semibold text-navyteal text-2xl">
          تفاصيل الباقات
        </p>
      </button>
    </div>
  );
};

export default ActionButtons