import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import api from "@/services/api";

const COMMUNITY_URL = "https://chat.learnatdolphin.com/";

const CommunityPage = () => {
  const [url, setUrl] = useState(COMMUNITY_URL);
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const height = isMobile ? "calc(100vh - 50px)" : "calc(100vh - 80px)";

  useEffect(() => {
    api.get("/codecanyon/login/session").then((res) => {
      setUrl(res.data.data.url);
    });
  }, []);
  return (
    <div className="w-full" >
      <div className="w-full" style={{ height }}>
        <iframe
          src={url}
          title="Community"
          className="w-full h-full"
          style={{ border: "none" }}
          allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
};

export default CommunityPage;


