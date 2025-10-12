import React, { useState } from 'react';
import dolphinEvaluate from '@/assets/images/dolphin-evaluate.svg';
import dolphinStars from '@/assets/images/dolphin-stars.svg';
import sendRateIcon from '@/assets/images/send-rate-icon.svg';
import { Teacher } from '@/utils/icons';

const SessionRatingModal = ({ onClose, onSubmit, sessions = [] }) => {
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});

    // Initialize state based on sessions
    React.useEffect(() => {
        if (!sessions || sessions.length === 0) return;
        
        const initialRatings = {};
        const initialComments = {};
        
        sessions.forEach((session, index) => {
            const sessionKey = `session${index + 1}`;
            initialRatings[sessionKey] = 0;
            initialComments[sessionKey] = '';
        });
        
        // Only update state if it's different to prevent infinite loops
        setRatings(prevRatings => {
            const hasChanged = Object.keys(initialRatings).some(key => 
                prevRatings[key] !== initialRatings[key]
            );
            return hasChanged ? initialRatings : prevRatings;
        });
        
        setComments(prevComments => {
            const hasChanged = Object.keys(initialComments).some(key => 
                prevComments[key] !== initialComments[key]
            );
            return hasChanged ? initialComments : prevComments;
        });
    }, [sessions?.length, sessions?.map(s => s.id).join(',')]);

    // Don't render if no sessions
    if (!sessions || sessions.length === 0) {
        return null;
    }

    // Validate sessions data
    const validSessions = sessions.filter(session => {
        return session && (session.id || session.lesson_id || session.session_id);
    });

    if (validSessions.length === 0) {
        console.warn('SessionRatingModal: No valid sessions found');
        return null;
    }

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

    const handleSubmit = async () => {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('Submitting session ratings:', { ratings, comments });
            }
            await onSubmit({ ratings, comments });
            
            // Reset state
            const resetRatings = {};
            const resetComments = {};
            validSessions.forEach((session, index) => {
                const sessionKey = `session${index + 1}`;
                resetRatings[sessionKey] = 0;
                resetComments[sessionKey] = '';
            });
            setRatings(resetRatings);
            setComments(resetComments);
        } catch (error) {
            console.error('Error submitting session ratings:', error);
        }
    };

    const handleSkip = () => {
        onClose();
        // Reset state
        const resetRatings = {};
        const resetComments = {};
        validSessions.forEach((session, index) => {
            const sessionKey = `session${index + 1}`;
            resetRatings[sessionKey] = 0;
            resetComments[sessionKey] = '';
        });
        setRatings(resetRatings);
        setComments(resetComments);
    };

    // Modal is always open when this component is rendered (controlled by ModalManager)

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl relative max-h-[90vh] flex flex-col">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 lg:w-10 lg:h-10 rounded-full border-[0.5px] border-solid border-[#8c8c8c] flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
                >
                    <span className="text-lg lg:text-2xl">×</span>
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-orange-200 to-blue-50 p-4 md:p-8 rounded-t-2xl text-center flex-shrink-0">
                    <div className="mb-4">
                        <img src={dolphinEvaluate} alt="Dolphin Character" className="mx-auto w-16 h-16 md:w-20 md:h-20" />
                    </div>
                    <h2 className="text-base md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                        كيف كانت جلساتك اليوم؟
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                        رأيك يهمنا ويساعدنا علي التحسين
                    </p>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 flex-1 overflow-y-auto no-scrollbar">
                    {/* Session Rating Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {validSessions.map((session, index) => {
                            const sessionKey = `session${index + 1}`;
                            const teacherName = session.teacher_name || session.teacherName || session.teacher?.name || 'المعلم';
                            const sessionTitle = session.subject || session.title || session.name || session.session_name || 'جلسة تعليمية';
                            
                            return (
                                <div key={session.id || index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[#165072] text-sm md:text-lg font-semibold">قيم الجلسة:</span>
                                        <div className="flex items-center gap-2 text-[#165072]">
                                            <Teacher className="w-4 h-4" />
                                            <span className="font-semibold text-sm md:text-lg">{teacherName}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Session Title */}
                                    <div className="mb-3">
                                        <h3 className="text-[#165072] text-sm md:text-base font-medium">
                                            {sessionTitle}
                                        </h3>
                                    </div>
                                    
                                    {/* Star Rating */}
                                    <div className="flex justify-start gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => handleRatingChange(sessionKey, star)}
                                                className="w-8 h-8 flex items-center justify-center transition-all"
                                            >
                                                <svg
                                                    className={`w-6 h-6 ${
                                                        ratings[sessionKey] >= star
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
                                    <div className="border-[0.5px] border-dashed border-[#1B648E] rounded-lg p-3 flex items-start gap-2 relative min-h-24">
                                        <textarea
                                            value={comments[sessionKey] || ''}
                                            onChange={(e) => handleCommentChange(sessionKey, e.target.value)}
                                            placeholder="شاركنا رأيك..."
                                            className="flex-1 text-sm md:text-lg text-[#707070] placeholder-[#707070] border-none outline-none resize-none"
                                            rows={2}
                                        />
                                        <img src={dolphinStars} alt="" className="flex-shrink-0 absolute -left-6 -top-4" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center w-full">
                        <button
                            onClick={handleSubmit}
                            disabled={validSessions.some((_, index) => ratings[`session${index + 1}`] === 0)}
                            className="px-6 py-3 bg-orangedeep text-navyteal flex items-center justify-center rounded-full w-40 md:w-60 cursor-pointer font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <img src={sendRateIcon} alt="send icon" />

                            ارسال
                        </button>
                        <button
                            onClick={handleSkip}
                            className="px-6 py-3 text-[#8C8C8C] font-semibold hover:text-gray-900 transition-colors w-40 md:w-60 cursor-pointer text-sm md:text-lg xl:text-xl"
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