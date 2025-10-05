import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ComplaintItem from './ComplaintItem';

const ComplaintsList = ({ complaints, loading }) => {
  const { t } = useTranslation();

  // Memoized utility functions
  const getStatusClass = useCallback((status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
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
      case 'resolved':
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
    if (fileType.startsWith('image/')) {
      return '🖼️';
    } else if (fileType.startsWith('video/')) {
      return '🎥';
    } else if (fileType === 'application/pdf') {
      return '📄';
    }
    return '📎';
  }, []);

  // Memoized loading component
  const loadingComponent = useMemo(() => (
    <div className="text-center py-16 text-gray-600">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-5"></div>
      <p>{t('common.loading')}</p>
    </div>
  ), [t]);

  // Memoized empty state component
  const emptyStateComponent = useMemo(() => (
    <div className="text-center py-20 text-gray-600">
      <div className="text-6xl mb-6 opacity-50">📝</div>
      <h3 className="text-xl mb-3 text-gray-700">{t('complaints.noComplaints')}</h3>
      <p className="text-base opacity-70 max-w-md mx-auto">{t('complaints.noComplaintsSubtext')}</p>
    </div>
  ), [t]);

  // Memoized complaint items
  const complaintItems = useMemo(() => 
    complaints.map((complaint) => (
      <ComplaintItem
        key={complaint.id}
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
    <div className="mt-8">
      <h2 className="text-3xl text-gray-700 mb-6 text-center">{t('complaints.myComplaints')}</h2>
      {complaintItems}
    </div>
  );
};

export default React.memo(ComplaintsList);
