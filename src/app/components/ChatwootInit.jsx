import { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const ChatwootInit = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const syncChatwoot = () => {
      if (!window.$chatwoot) return;

      if (isAuthenticated && user) {
        window.$chatwoot.setUser(String(user.id), {
          name: user.name,
          avatar_url: user.profilePicture,
          phone_number: user.phoneNumber || "",
        });

        window.$chatwoot.setCustomAttributes({
          referralCode: user.referralCode,
          grade: user.gradeName,
        });
      } else {
        // Reset if user logs out
        if (typeof window.$chatwoot.reset === "function") {
          window.$chatwoot.reset();
        }
      }
    };

    // Run immediately if SDK is ready
    if (window.$chatwoot?.hasLoaded) {
      syncChatwoot();
    }

    // Also listen for Chatwoot "ready"
    document.addEventListener("chatwoot:ready", syncChatwoot);
    return () => document.removeEventListener("chatwoot:ready", syncChatwoot);
  }, [isAuthenticated, user]);

  return null;
};

export default ChatwootInit;
