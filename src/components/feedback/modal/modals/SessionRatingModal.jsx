import React, { useState } from 'react';
import dolphinEvaluate from '@/assets/images/dolphin-evaluate.svg';

const SessionRatingModal = ({ isOpen, onClose, onSubmit }) => {
    const [ratings, setRatings] = useState({
        session1: 0,
        session2: 0
    });
    const [comments, setComments] = useState({
        session1: '',
        session2: ''
    });

    const handleRatingChange = (session, value) => {
        setRatings(prev => ({
            ...prev,
            [session]: value
        }));
    };

    const handleCommentChange = (session, value) => {
        setComments(prev => ({
            ...prev,
            [session]: value
        }));
    };

    const handleSubmit = () => {
        onSubmit({ ratings, comments });
        setRatings({ session1: 0, session2: 0 });
        setComments({ session1: '', session2: '' });
    };

    const handleSkip = () => {
        onClose();
        setRatings({ session1: 0, session2: 0 });
        setComments({ session1: '', session2: '' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors z-10"
                >
                    <span className="text-lg">×</span>
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-orange-200 to-blue-50 p-8 rounded-t-2xl text-center">
                    <div className="mb-4">
                        <img src={dolphinEvaluate} alt="Dolphin Character" className="mx-auto w-20 h-20" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        كيف كانت جلساتك أمس؟
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                        رأيك يهمنا ويساعدنا علي التحسين
                    </p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Session Rating Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Session 1 Card */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-800 text-sm">قيم الجلسة:</span>
                                </div>
                                <span className="text-gray-800 font-medium">أ. حنان</span>
                            </div>
                            
                            {/* Star Rating */}
                            <div className="flex justify-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRatingChange('session1', star)}
                                        className="w-8 h-8 flex items-center justify-center transition-all"
                                    >
                                        <svg
                                            className={`w-6 h-6 ${
                                                ratings.session1 >= star
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                            />
                                        </svg>
                                    </button>
                                ))}
                            </div>

                            {/* Comment Textarea */}
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 flex items-start gap-2">
                                <img src={dolphinEvaluate} alt="" className="w-6 h-6 flex-shrink-0" />
                                <textarea
                                    value={comments.session1}
                                    onChange={(e) => handleCommentChange('session1', e.target.value)}
                                    placeholder="شاركنا رأيك..."
                                    className="flex-1 text-sm text-gray-500 placeholder-gray-400 border-none outline-none resize-none"
                                    rows={2}
                                />
                            </div>
                        </div>

                        {/* Session 2 Card */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-800 text-sm">قيم الجلسة:</span>
                                </div>
                                <span className="text-gray-800 font-medium">أ. حنان</span>
                            </div>
                            
                            {/* Star Rating */}
                            <div className="flex justify-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRatingChange('session2', star)}
                                        className="w-8 h-8 flex items-center justify-center transition-all"
                                    >
                                        <svg
                                            className={`w-6 h-6 ${
                                                ratings.session2 >= star
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                            />
                                        </svg>
                                    </button>
                                ))}
                            </div>

                            {/* Comment Textarea */}
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 flex items-start gap-2">
                                <img src={dolphinEvaluate} alt="" className="w-6 h-6 flex-shrink-0" />
                                <textarea
                                    value={comments.session2}
                                    onChange={(e) => handleCommentChange('session2', e.target.value)}
                                    placeholder="شاركنا رأيك..."
                                    className="flex-1 text-sm text-gray-500 placeholder-gray-400 border-none outline-none resize-none"
                                    rows={2}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center w-full">
                        <button
                            onClick={handleSubmit}
                            disabled={ratings.session1 === 0 || ratings.session2 === 0}
                            className="px-6 py-3 bg-orangedeep text-navyteal flex items-center justify-center rounded-full cursor-pointer w-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                            ارسال
                        </button>
                        <button
                            onClick={handleSkip}
                            className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors w-50 cursor-pointer"
                        >
                            تخطي
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionRatingModal;