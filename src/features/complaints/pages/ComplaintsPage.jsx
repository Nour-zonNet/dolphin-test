import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useComplaints } from "../hooks/useComplaints";
import ComplaintForm from "../components/ComplaintForm";
import ComplaintsList from "../components/ComplaintsList";
import { Header } from "../../../components/layout";
import setting from "../../../assets/complaints/setting.png";
const ComplaintsPage = () => {
  const { t } = useTranslation();
  const { items, loading, fetchComplaints } = useComplaints();
  const [showForm, setShowForm] = useState(false);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleShowForm = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    fetchComplaints();
  }, [fetchComplaints]);

  // Memoized header content
  const headerContent = useMemo(
    () => (
      <div className=" mb-6 sm:mb-8 p-4 sm:p-6 md:p-8 border border-[#D9D9D9] flex flex-row  rounded-xl sm:rounded-2xl text-navyteal">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 sm:mb-3 leading-tight">
            {t("complaints.title")}
          </h1>
          <p className="text-sm text-[#5C6064] sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-5 opacity-90 leading-relaxed px-2">
            {t("complaints.description")}
          </p>
          <button
            onClick={handleShowForm}
            className="bg-orangedeep flex items-center justify-center gap-2 text-navyteal border-2 border-white  px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold 
                  hover:cursor-pointer  hover:-translate-y-0.5 transition-all duration-300
                   focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-orangedeep"
          >
            <svg
              width="14"
              height="13"
              viewBox="0 0 14 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.1056 5.23687L8.07086 5.23687L8.07086 1.20215C8.07086 0.598082 7.58117 0.108398 6.97711 0.108398C6.37304 0.108398 5.88336 0.598082 5.88336 1.20215L5.88336 5.23687L1.84863 5.23687C1.24457 5.23687 0.754883 5.72655 0.754883 6.33062C0.754883 6.93469 1.24457 7.42437 1.84863 7.42437L5.88336 7.42437L5.88336 11.4591C5.88336 12.0632 6.37304 12.5528 6.97711 12.5528C7.58117 12.5528 8.07086 12.0632 8.07086 11.4591L8.07086 7.42437L12.1056 7.42437C12.7096 7.42437 13.1993 6.93469 13.1993 6.33062C13.1993 5.72655 12.7096 5.23687 12.1056 5.23687Z"
                fill="#08233F"
              />
            </svg>

            {t("complaints.addComplaint")}
          </button>
        </div>
        <div className=" mx-auto flex items-center justify-end">
          <img src={setting} className="w-18 h-18 " alt="complaints" />
        </div>
      </div>
    ),
    [t, handleShowForm]
  );

  // Memoized form component
  const complaintForm = useMemo(
    () =>
      showForm && (
        <ComplaintForm
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      ),
    [showForm, handleCloseForm, handleFormSuccess]
  );

  // Memoized complaints list
  const complaintsList = useMemo(
    () => <ComplaintsList complaints={items } loading={loading} />,
    [items, loading]
  );

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  return (
    <div className="min-h-screen  ">
      <Header title={"الدعم الفني"} onBack={"/profile"} />
      <div className="px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-5 max-w-4xl mx-auto">
        {headerContent}
        {complaintForm}
        {complaintsList}
      </div>
    </div>
  );
};

export default React.memo(ComplaintsPage);
