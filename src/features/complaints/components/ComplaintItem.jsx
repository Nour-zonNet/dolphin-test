import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const ComplaintItem = memo(({ complaint, formatDate, getStatusClass, getStatusText, getFileIcon }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-5 shadow-lg border-r-4 border-blue-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2 sm:gap-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 flex-1 leading-tight">{complaint.title}</h3>
        <div className="flex flex-col sm:items-end gap-2">
          <span className="text-gray-500 text-xs sm:text-sm">{formatDate(complaint.createdAt)}</span>
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusClass(complaint.status)}`}>
            {getStatusText(complaint.status)}
          </span>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 inline-block">
        {t(`complaints.categories.${complaint.category}`)}
      </div>
      
      <p className="text-gray-600 leading-relaxed mb-4 sm:mb-5 text-sm sm:text-base">{complaint.description}</p>
      
      {complaint.files && complaint.files.length > 0 && (
        <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <h4 className="text-gray-700 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('complaints.attachments')}:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {complaint.files.map((file, index) => (
              <div key={index} className="flex items-center bg-white p-2 sm:p-3 rounded-md shadow-sm">
                <span className="text-base sm:text-lg mr-2 sm:mr-3 flex-shrink-0">{getFileIcon(file.type)}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-700 break-all text-xs sm:text-sm truncate block">{file.name}</span>
                </div>
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 text-xs font-medium px-2 py-1 rounded bg-blue-50 hover:bg-blue-500 hover:text-white transition-all duration-300 flex-shrink-0 ml-2"
                >
                  {t('complaints.download')}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {complaint.response && (
        <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-green-50 rounded-lg border-r-3 border-green-500">
          <h4 className="text-green-700 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">{t('complaints.response')}:</h4>
          <p className="text-green-700 leading-relaxed mb-2 sm:mb-3 text-sm sm:text-base">{complaint.response}</p>
          {complaint.responseDate && (
            <span className="text-xs text-gray-500 italic">
              {t('complaints.responseDate')}: {formatDate(complaint.responseDate)}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

ComplaintItem.displayName = 'ComplaintItem';

export default ComplaintItem;
