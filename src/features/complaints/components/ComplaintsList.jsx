import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ComplaintItem from './ComplaintItem';
import notFoundImg from "../../../assets/complaints/notFound.svg";
import fileIcon from "../../../assets/schedule/file-icon.svg";

const ComplaintsList = ({ complaints, loading }) => {
  const { t } = useTranslation();

  // Memoized utility functions
  const getStatusClass = useCallback((status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'addressed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  }, []);

  const getStatusText = useCallback((status) => {
    switch (status) {
      case 'pending':
        return t('complaints.status.pending');
      case 'in_progress':
        return t('complaints.status.inProgress');
      case 'addressed':
        return t('complaints.status.resolved');
      default:
        return t('complaints.status.pending');
    }
  }, [t]);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const getFileIcon = useCallback((fileType) => {
    if (fileType.startsWith('image')) {
      return fileIcon;
    } else if (fileType.startsWith('video')) {
      return fileIcon;
    } else if (fileType === 'pdf') {
      return fileIcon;
    }
    return fileIcon;
  }, []);

  // Memoized loading component
  const loadingComponent = useMemo(() => (
    <div className="text-center py-12 sm:py-16 text-gray-600">
      <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4 sm:mb-5"></div>
      <p className="text-sm sm:text-base">{t('common.loading')}</p>
    </div>
  ), [t]);

  // Memoized empty state component
  const emptyStateComponent = useMemo(() => (
    <div className="text-center py-16 sm:py-20 text-gray-600">
      <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 ">

        <img src={notFoundImg} alt="notFound" className="mx-auto w-42" />
      </div>
      <h3 className="text-lg sm:text-xl mb-2 sm:mb-3 text-gray-700">{t('complaints.noComplaints')}</h3>
      <p className="text-sm sm:text-base opacity-70 max-w-md mx-auto px-4">{t('complaints.noComplaintsSubtext')}</p>
    </div>
  ), [t]);

  // Memoized complaint items
  const complaintItems = useMemo(() => 
    complaints.map((complaint) => (
      <ComplaintItem
        key={complaint?.id}
        complaint={complaint}
        formatDate={formatDate}
        getStatusClass={getStatusClass}
        getStatusText={getStatusText}
        getFileIcon={getFileIcon}
      />
    )), [complaints, formatDate, getStatusClass, getStatusText, getFileIcon]);

  // Early returns for loading and empty states
  if (loading) {
    return loadingComponent;
  }

  if (!complaints || complaints.length === 0) {
    return emptyStateComponent;
  }

  return (
    <div className="mt-6 sm:mt-8">
      <h2 className="text-xl  sm:text-2xl md:text-3xl text-gray-700 mb-4 sm:mb-6 text-center">{t('complaints.myComplaints')}</h2>
      <div className="space-y-4 sm:space-y-5 py-10">
        {complaintItems}
      </div>
    </div>
  );
};

export default React.memo(ComplaintsList);
