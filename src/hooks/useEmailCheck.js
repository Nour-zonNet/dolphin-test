import { useEffect, useRef } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useModal } from "@/components/feedback/modal/useModal";
import { useNavigate } from "react-router-dom";

export const useEmailCheck = () => {
  const { user, isFullyAuthenticated, hasEmail } = useAuth();
  const { openEmailRequiredModal } = useModal();
  const navigate = useNavigate();
  const hasShownModal = useRef(false);
  const { updateUser } = useAuth();
  useEffect(() => {
    // Only check if user is fully authenticated and we haven't shown the modal yet
    if (isFullyAuthenticated() && user && !hasShownModal.current) {
      // Check if user doesn't have an email
      if (!hasEmail()) {
        hasShownModal.current = true;
        
        // Show the email required modal with navigation callback
        openEmailRequiredModal(async (email) => {
          await updateUser({
            email: email,
            name: user.name,
            grade: user.grade,
            _method: "PATCH",
          });
        });
      }
    }
  }, [user, isFullyAuthenticated, hasEmail, openEmailRequiredModal, navigate, updateUser]);

  // Reset the modal flag when user changes (e.g., logout/login)
  useEffect(() => {
    if (!user) {
      hasShownModal.current = false;
    }
  }, [user]);
};
