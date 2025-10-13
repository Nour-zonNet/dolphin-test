import { useSessionRatingModal } from '@/features/lessons/hooks/useSessionRatingModal';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/modalSlice';
import { MODAL_TYPES } from '@/constants/MODAL_TYPES';
import { useLocation } from 'react-router-dom';

const SessionRatingInitializer = () => {
  const location = useLocation();
  
  // This hook will automatically check for today's ended sessions and show the modal if needed
  // Only run the hook on schedule page for production behavior
  const { eligibleSessions, handleSubmitRatings, handleCloseModal } = useSessionRatingModal();
  const dispatch = useDispatch();
  
  // For testing: Add a way to manually trigger the modal
  if (process.env.NODE_ENV === 'development') {
    // Add a global function to force show the modal for testing
    window.showSessionRatingModal = () => {
      if (eligibleSessions.length > 0) {
        dispatch(openModal({
          type: MODAL_TYPES.SESSION_RATING,
          props: {
            sessions: eligibleSessions,
            onSubmit: handleSubmitRatings,
            onClose: handleCloseModal
          }
        }));
        console.log('Manually triggered SessionRatingModal with sessions:', eligibleSessions);
      } else {
        console.log('No eligible sessions available for rating');
        console.log('Available sessions:', eligibleSessions);
      }
    };
    
    // Add a function to create test sessions
    window.createTestSessions = () => {
      const testSessions = [
        {
          id: 1,
          class_session_id: 30895,
          teacher_name: 'محمود جمال',
          subject: 'الرياضيات',
          date: '2025-10-12',
          start_time: '10:00',
          status: 'ended'
        },
        {
          id: 2,
          class_session_id: 30896,
          teacher_name: 'أحمد محمد',
          subject: 'اللغة العربية',
          date: '2025-10-12',
          start_time: '11:00',
          status: 'ended'
        }
      ];
      
      dispatch(openModal({
        type: MODAL_TYPES.SESSION_RATING,
        props: {
          sessions: testSessions,
          onSubmit: handleSubmitRatings,
          onClose: handleCloseModal
        }
      }));
      console.log('Created test sessions for modal:', testSessions);
    };
    
    // Add a simple function to show modal immediately
    window.testSessionRatingModal = () => {
      const testSessions = [
        {
          id: 1,
          class_session_id: 30895,
          teacher_name: 'محمود جمال',
          subject: 'الرياضيات',
          date: '2025-10-12',
          start_time: '10:00',
          status: 'ended'
        },
        {
          id: 2,
          class_session_id: 30896,
          teacher_name: 'أحمد محمد',
          subject: 'اللغة العربية',
          date: '2025-10-12',
          start_time: '11:00',
          status: 'ended'
        }
      ];
      
      dispatch(openModal({
        type: MODAL_TYPES.SESSION_RATING,
        props: {
          sessions: testSessions,
          onSubmit: async (data) => {
            console.log('Test submission:', data);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Test submission completed');
          },
          onClose: () => {
            console.log('Test modal closed');
          }
        }
      }));
      console.log('Test SessionRatingModal opened with test sessions');
    };
    
    console.log('SessionRatingModal testing functions available:');
    console.log('- window.showSessionRatingModal() - Show modal with current eligible sessions');
    console.log('- window.createTestSessions() - Show modal with test sessions');
    console.log('- window.testSessionRatingModal() - Show modal immediately for testing');
  }
  
  // Only initialize automatic modal checking on schedule page
  if (!location.pathname.includes('/schedule')) {
    return null;
  }
  
  return null;
};

export default SessionRatingInitializer;