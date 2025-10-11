import React, { useState } from 'react';
import SessionRatingModal from './SessionRatingModal';

const SessionRatingModalTest = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitRatings = (data) => {
        console.log('Submitted ratings and comments:', data);
        alert('تم إرسال التقييمات بنجاح! شكراً لك.');
        setIsModalOpen(false);
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    اختبار نموذج تقييم الجلسات
                </h1>
                
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        اختبار SessionRatingModal
                    </h2>
                    <p className="text-gray-600 mb-4">
                        اضغط على الزر أدناه لفتح نموذج تقييم الجلسات مع بيانات وهمية للاختبار.
                    </p>
                    
                    <button
                        onClick={handleOpenModal}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        فتح نموذج التقييم (وضع الاختبار)
                    </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">ملاحظات الاختبار:</h3>
                    <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• سيتم عرض 3 جلسات وهمية للاختبار</li>
                        <li>• يمكنك تقييم كل جلسة من 1 إلى 5 نجوم</li>
                        <li>• يمكنك إضافة تعليقات لكل جلسة</li>
                        <li>• يجب تقييم جميع الجلسات قبل إرسال التقييم</li>
                        <li>• يمكنك تخطي التقييم باستخدام زر "تخطي"</li>
                    </ul>
                </div>
            </div>

            <SessionRatingModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitRatings}
                testMode={true}
            />
        </div>
    );
};

export default SessionRatingModalTest;
