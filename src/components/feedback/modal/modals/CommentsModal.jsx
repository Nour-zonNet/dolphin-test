import React, { useState, useMemo, useEffect } from "react";
import ModalContainer from "../ModalContainer";
import { Teacher, ChevronDown } from "@/utils/icons";
import { X } from "lucide-react";

const CommentsModal = ({ onClose, subject }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("شهري");

  // Debug: Log the subject data to see what we're receiving
  console.log("Subject data:", subject);
  console.log("Subject reviews:", subject?.reviews);
  console.log("Subject teachers:", subject?.teachers);

  // Format date to relative time or absolute date
  const formatDate = (dateString) => {
    if (!dateString) return "تاريخ غير معروف";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return "منذ يوم";
      if (diffDays <= 7) return `منذ ${diffDays} أيام`;
      if (diffDays <= 30) return `منذ ${Math.ceil(diffDays / 7)} أسابيع`;
      
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return "تاريخ غير معروف";
    }
  };

  // Get rating text based on numeric rating
  const getRatingText = (rating) => {
    const ratingTexts = {
      5: "ممتاز",
      4: "جيد جداً",
      3: "جيد",
      2: "مقبول",
      1: "يحتاج تحسين"
    };
    return ratingTexts[rating] || "";
  };

  // Period options
  const periods = [
    { value: "شهري", label: "شهري" },
    { value: "فصلي", label: "فصلي" }
  ];

  // Transform API data to modal format based on selected period
  const transformCommentsData = useMemo(() => {
    console.log("Transforming comments data...");
    
    // Check different possible data structures
    const reviews = subject?.reviews || subject?.apiData?.reviews || [];
    console.log("Found reviews:", reviews);
    
    if (reviews.length === 0) {
      console.log("No reviews found in subject data");
      return [];
    }

    // Filter and transform reviews based on selected period
    const filteredReviews = reviews.filter(review => {
      if (!review.created_at) return false;
      
      if (selectedPeriod === "شهري") {
        // For monthly, show recent reviews (last 30 days)
        try {
          const reviewDate = new Date(review.created_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return reviewDate >= thirtyDaysAgo;
        } catch (error) {
          return false;
        }
      } else {
        // For semesterly, show all reviews
        return true;
      }
    });

    console.log("Filtered reviews:", filteredReviews);

    // Group by teacher and date to avoid duplicates, include ALL reviews with teacher data
    const uniqueComments = filteredReviews.reduce((acc, review) => {
      // Check if review has teacher data (include all reviews, even without comments)
      if (review.teacher && review.teacher.name) {
        const key = `${review.teacher.name}-${review.comment || 'no-comment'}-${review.created_at}`;
        if (!acc[key]) {
          acc[key] = {
            id: review.id || Math.random(),
            instructor: review.teacher.name,
            date: formatDate(review.created_at),
            comment: review.comment || null,
            rating: review.rating || 0,
            canEdit: false,
            created_at: review.created_at,
            hasComment: !!review.comment
          };
        }
      }
      return acc;
    }, {});

    const result = Object.values(uniqueComments).sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    console.log("Final comments:", result);
    return result;
  }, [subject, selectedPeriod]);

  const comments = transformCommentsData;

  // Get teachers from different possible data structures
  const teachers = subject?.teachers || subject?.apiData?.teachers || [];
  const subjectName = subject?.name || subject?.apiData?.subject?.name || "المادة";

  // Detect screen size (Tailwind lg breakpoint: 1024px)
  const [isLargeScreen, setIsLargeScreen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const handleChange = (e) => setIsLargeScreen(e.matches);
    if (mql.addEventListener) mql.addEventListener("change", handleChange);
    else mql.addListener(handleChange);
    setIsLargeScreen(mql.matches);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handleChange);
      else mql.removeListener(handleChange);
    };
  }, []);

  // Enable vertical scroll when exceeding 2 rows
  // Desktop (lg+, 2 columns): > 4 comments
  // Mobile/Tablet (1 column): > 2 comments
  const maxVisibleWithoutScroll = isLargeScreen ? 4 : 2;
  const needsVerticalScroll = comments.length > maxVisibleWithoutScroll;

  return (
    <ModalContainer onClose={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full min-w-xs md:min-w-xl xl:min-w-2xl md:max-w-xl mx-auto max-h-[80vh] min-h-[60vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-navyteal" />
          </button>
          <h2 className="text-sm md:text-xl font-semibold text-navyteal text-center absolute left-1/2 -translate-x-1/2">
            التعليقات - {subjectName}
          </h2>
        </div>

        {/* Separator */}
        <div className="border-t border-dashed border-gray-300 mb-4"></div>

        {/* Period Dropdown and Stats */}
        <div className="mb-6 space-y-4">
          {/* Period Dropdown */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-3 pr-4 pl-10 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orangedeep focus:border-transparent text-center"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-navyteal" />
            </div>
          </div>

          {/* Statistics */}
          <div className="flex items-center justify-between text-sm text-navyteal bg-gray-50 p-3 rounded-lg">
            <span>
              إجمالي التقييمات: <strong>{comments.length}</strong>
            </span>
            <span>
              عدد المدرسين: <strong>{teachers.length}</strong>
            </span>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-hidden">
          <div className={`h-full ${needsVerticalScroll ? 'overflow-y-auto' : 'overflow-y-hidden'} pr-2 custom-scrollbar`}>
            {comments.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                {comments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className="bg-[#F4F4F4] rounded-bl-[32px] rounded-br-[32px] rounded-tl-[32px] p-6 relative"
                  >

                    {/* Comment Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-navyteal">
                        <Teacher className="w-4 h-4 md:w-6 md:h-6" />
                        <span className="text-xs md:text-base font-semibold">{comment.instructor}</span>
                      </div>
                      <span className="text-xs md:text-base font-semibold text-[#525D67]">{comment.date}</span>
                    </div>
                    
                    {/* Rating Text */}
                    {comment.rating > 0 && (
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          comment.rating >= 4 ? 'text-green-600' : 
                          comment.rating >= 3 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {getRatingText(comment.rating)}
                        </span>
                        {/* Rating Badge */}
                        {comment.rating > 0 && (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-navyteal text-xs font-bold ${
                            comment.rating >= 4 ? 'text-green-500' : 
                            comment.rating >= 3 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            <div className="flex items-center">
                              (
                              <span>⭐</span>
                              <span>{comment.rating}</span>
                              )
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Comment Text or No Comment Message */}
                    {comment.hasComment ? (
                      <p className="text-sm md:text-base text-navyteal leading-relaxed">
                        {comment.comment}
                      </p>
                    ) : (
                      <div className="py-2">
                        <p className="text-sm text-gray-500 italic">
                          لا يوجد تعليق نصي
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Teacher className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium mb-2">لا توجد تعليقات متاحة</p>
                <p className="text-sm">
                  {selectedPeriod === "شهري" 
                    ? "لا توجد تعليقات لهذا الشهر" 
                    : "لا توجد تعليقات لهذا الفصل"
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default CommentsModal;
