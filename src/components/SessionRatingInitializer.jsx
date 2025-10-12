import { useSessionRatingModal } from '@/features/lessons/hooks/useSessionRatingModal';

const SessionRatingInitializer = () => {
  // This hook will automatically check for today's ended sessions and show the modal if needed
  useSessionRatingModal();
  
  return null; // This component doesn't render anything
};

export default SessionRatingInitializer;
