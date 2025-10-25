import { useEmailCheck } from "@/hooks/useEmailCheck";

const EmailCheckInitializer = () => {
  // Initialize email check functionality
  useEmailCheck();
  
  // This component doesn't render anything, it just initializes the hook
  return null;
};

export default EmailCheckInitializer;
