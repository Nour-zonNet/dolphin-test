import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useComplaints } from "../hooks/useComplaints";
import ComplaintForm from "../components/ComplaintForm";
import ComplaintsList from "../components/ComplaintsList";
import { Header } from "../../../components/layout";

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
      <div className="text-center mb-6 sm:mb-8 p-4 sm:p-6 md:p-8 bg-gradient-to-r from-orangedeep/90 to-orangedeep rounded-xl sm:rounded-2xl text-white">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 leading-tight">
          {t("complaints.title")}
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-5 opacity-90 leading-relaxed px-2">
          {t("complaints.description")}
        </p>
        <button
          onClick={handleShowForm}
          className="bg-white/20 border-2 border-white text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold 
                   hover:bg-white hover:text-orangedeep hover:-translate-y-0.5 transition-all duration-300
                   focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-orangedeep"
        >
          {t("complaints.addComplaint")}
        </button>
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
    () => <ComplaintsList complaints={items} loading={loading} />,
    [items, loading]
  );

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  return (
    <div className="min-h-screen bg-gray-50">
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
