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
      <div className="text-center mb-8 p-5 bg-gradient-to-r bg-orangedeep rounded-2xl text-white">
        <h1 className="text-4xl font-bold mb-3">{t("complaints.title")}</h1>
        <p className="text-lg mb-5 opacity-90">{t("complaints.description")}</p>
        <button
          className="bg-white bg-opacity-20 border-2 border-orangedeep text-orangedeep px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-orangedeep hover:-translate-y-0.5 transition-all duration-300"
          onClick={handleShowForm}
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
    <div className="min-h-screen">
      <Header title={"الدعم الفني"} onBack={"/profile"} />
      <div className=" p-5 max-w-4xl mx-auto">
        {headerContent}
        {complaintForm}
        {complaintsList}
      </div>
    </div>
  );
};

export default React.memo(ComplaintsPage);
