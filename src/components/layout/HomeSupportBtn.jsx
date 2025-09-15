import { useEffect, useState, useMemo, useRef } from "react";
import dolphinCallCenter from "@/assets/images/dolphin-call-center.svg";
import whatsapp from "@/assets/images/whatsapp.svg";
import youtube from "@/assets/images/youtube.svg";
import snapchat from "@/assets/images/snapchat.svg";
import LifeChat from "@/assets/images/message.svg";
import { X } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import api from "../../services/api";

const HomeSupportBtn = ({ className }) => {
  const { isAuthenticated, user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [radius, setRadius] = useState(70);
  const [supportNumber, setSupportNumber] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [supportNote, setSupportNote] = useState("");
  const [loadingSupport, setLoadingSupport] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const wrapperRef = useRef(null);

  const closeAll = () => {
    setIsOpen(false);
    if (isChatOpen && window.$chatwoot) {
      window.$chatwoot.hide?.() || window.$chatwoot.toggle?.();
      setIsChatOpen(false);
    }
  };

  // Fetch support number
  useEffect(() => {
    const controller = new AbortController();

    const fetchSupport = async () => {
      try {
        setLoadingSupport(true);
        const res = await api.get("/student/support-number", {
          signal: controller.signal,
        });
        if (res?.data?.success) {
          const raw = res.data.data.support_number || "";
          setSupportNumber(String(raw).replace(/\D/g, ""));
          setSubscriptionStatus(res.data.data.subscription_status || "");
          setSupportNote(res.data.data.message || "");
        }
      } catch (e) {
        if (e.name !== "CanceledError") {
          console.error(
            "Failed to fetch support number:",
            e?.response?.data || e?.message || e
          );
        }
      } finally {
        setLoadingSupport(false);
      }
    };

    fetchSupport();

    return () => controller.abort();
  }, [isAuthenticated]);

  const defaultWAString = useMemo(() => {
    if (isAuthenticated && user) {
      const base = "اهلا فريق دعم منصة الدلفين 💙 ، احتاج الي مساعدة";
      const phoneNumber = user.phoneNumber
        ? `\nو رقم جوالي المسجل علي المنصة هو : ${user.phoneNumber}`
        : "";
      return encodeURIComponent(`${base}${phoneNumber}`);
    }
    return encodeURIComponent("اهلاً دعم منصة الدلفين، محتاج مساعدة 🙏");
  }, [isAuthenticated, user]);

  const whatsappUrl = useMemo(() => {
    if (!supportNumber) return "";
    return `https://wa.me/${supportNumber}?text=${defaultWAString}`;
  }, [supportNumber, defaultWAString]);

  const openWhatsApp = () => {
    if (!supportNumber) {
      alert("تعذر جلب رقم الدعم الآن. حاول مرة أخرى لاحقًا.");
      return;
    }
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const toggleChatwoot = () => {
    if (!window.$chatwoot) return;
    window.$chatwoot.show?.() || window.$chatwoot.toggle?.();
    setIsChatOpen((prev) => !prev);
  };

  // Close on outside click or Escape
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        closeAll();
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeAll();
    };

    document.addEventListener("mousedown", handlePointerDown, true);
    document.addEventListener("touchstart", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown, true);
      document.removeEventListener("touchstart", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isChatOpen]);

  // Update radius on resize
  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 640) setRadius(70);
      else if (window.innerWidth < 1024) setRadius(90);
      else setRadius(100);
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const buttons = useMemo(() => {
    if (isAuthenticated)
      return [
        { icon: whatsapp, angle: -40, alt: "WhatsApp", onClick: openWhatsApp },
        {
          icon: LifeChat,
          angle: 10,
          alt: "LifeChat",
          onClick: toggleChatwoot,
          isChat: true,
        },
      ];
    return [
      { icon: whatsapp, angle: -90, alt: "WhatsApp", onClick: openWhatsApp },
      {
        icon: youtube,
        angle: -50,
        alt: "YouTube",
        onClick: () =>
          window.open(
            "https://www.youtube.com/@Learnatdolphin",
            "_blank",
            "noopener,noreferrer"
          ),
      },
      {
        icon: snapchat,
        angle: -10,
        alt: "Snapchat",
        onClick: () =>
          window.open(
            "https://snapchat.com/t/CwY0kRTD",
            "_blank",
            "noopener,noreferrer"
          ),
      },
    ];
  }, [isAuthenticated, supportNumber, defaultWAString]);

  return (
    <div
      ref={wrapperRef}
      className={
        className ?? "fixed bottom-18 md:bottom-24 lg:bottom-24 right-0 z-50"
      }
    >
      <div className="relative w-18 h-18 mx-4 sm:mx-6">
        {buttons.map((btn, i) => {
          const rad = (btn.angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          return (
            <button
              key={i}
              onClick={btn.onClick}
              aria-label={btn.alt}
              title={
                btn.alt === "WhatsApp" && supportNote
                  ? `${btn.alt} • ${supportNote}`
                  : btn.alt
              }
              disabled={btn.alt === "WhatsApp" && loadingSupport}
              className={`absolute w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 focus:outline-0 rounded-full bg-orangedeep shadow-lg flex items-center justify-center cursor-pointer
                transition-all duration-300
                ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"}
                ${
                  btn.alt === "WhatsApp" && loadingSupport
                    ? "opacity-60 cursor-wait"
                    : ""
                }`}
              style={{
                transform: `translate(${isOpen ? -x : 0}px, ${
                  isOpen ? y : 0
                }px)`,
              }}
            >
              {btn.isChat && isChatOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <img
                  src={btn.icon}
                  loading="lazy"
                  alt={btn.alt}
                  className="w-6 h-6"
                />
              )}
            </button>
          );
        })}

        <button
          onClick={() => setIsOpen((v) => !v)}
          className="flex items-center justify-center w-15 h-15 md:w-20 md:h-20 bg-orangedeep rounded-full shadow-lg hover:bg-btnClicked focus:bg-[#BA7C28] cursor-pointer transition-transform duration-300 focus:outline-0 hover:scale-110 relative z-10"
          title="الدعم"
        >
          <img loading="lazy" src={dolphinCallCenter} alt="Support" />
        </button>
      </div>
    </div>
  );
};

export default HomeSupportBtn;
