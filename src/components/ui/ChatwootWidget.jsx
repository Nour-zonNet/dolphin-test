import { useEffect } from "react";

const ChatwootWidget = () => {
  useEffect(() => {
    const BASE_URL = "https://chat.learnadolphin.com";
    const script = document.createElement("script");
    script.src = BASE_URL + "/packs/js/sdk.js";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window && window.chatwootSDK) {
        window.chatwootSDK.run({
          websiteToken: "xpqe76ifim8597gd5FQ2dRyk",
          baseUrl: BASE_URL,
          hideMessageBubble: true, // 👈 hides the default widget bubble
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleOpenChat = () => {
    if (window.$chatwoot) {
      window.$chatwoot.open(); // directly open messages widget
    }
  };

  return (
    <button
      onClick={handleOpenChat}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 8h10M7 12h6m-6 4h4m-5 4h10l4-4V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      Messages
    </button>
  );
};

export default ChatwootWidget;
