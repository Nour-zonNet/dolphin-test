import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const ComplaintItem = memo(({ complaint, formatDate, getStatusClass, getStatusText, getFileIcon }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl p-6 mb-5 shadow-lg border-r-4 border-blue-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4 gap-4">
        <h3 className="text-xl font-semibold text-gray-700 flex-1">{complaint.title}</h3>
        <div className="flex flex-col items-end gap-2">
          <span className="text-gray-500 text-sm">{formatDate(complaint.createdAt)}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusClass(complaint.status)}`}>
            {getStatusText(complaint.status)}
          </span>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 inline-block">
        {t(`complaints.categories.${complaint.category}`)}
      </div>
      
      <p className="text-gray-600 leading-relaxed mb-5 text-base">{complaint.description}</p>
      
      {complaint.files && complaint.files.length > 0 && (
        <div className="mt-5 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-gray-700 font-semibold mb-4">{t('complaints.attachments')}:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {complaint.files.map((file, index) => (
              <div key={index} className="flex items-center bg-white p-3 rounded-md shadow-sm">
                <span className="text-lg mr-3">{getFileIcon(file.type)}</span>
                <div className="flex-1">
                  <span className="font-medium text-gray-700 break-all text-sm">{file.name}</span>
                </div>
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 text-xs font-medium px-2 py-1 rounded bg-blue-50 hover:bg-blue-500 hover:text-white transition-all duration-300"
                >
                  {t('complaints.download')}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {complaint.response && (
        <div className="mt-5 p-4 bg-green-50 rounded-lg border-r-3 border-green-500">
          <h4 className="text-green-700 font-semibold mb-3">{t('complaints.response')}:</h4>
          <p className="text-green-700 leading-relaxed mb-3">{complaint.response}</p>
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
