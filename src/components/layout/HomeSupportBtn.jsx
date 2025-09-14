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

  // 🟢 مرجع للحاوية عشان نعرف لو الضغط تم خارجها
  const wrapperRef = useRef(null);

  // 🟢 دالة موحّدة لإغلاق كل شيء
  const closeAll = () => {
    setIsOpen(false);
    if (isChatOpen) {
      // استخدم hide لو متاحة، وإلا toggle للإغلاق
      if (window.$chatwoot?.hide) {
        window.$chatwoot.hide();
      } else {
        window.$chatwoot?.toggle?.();
      }
      setIsChatOpen(false);
    }
  };

  // === جلب رقم الدعم
  useEffect(() => {
    let isMounted = true;
    const fetchSupport = async () => {
      try {
        setLoadingSupport(true);
        const res = await api.get("/student/support-number");
        if (isMounted && res?.data?.success) {
          const raw = res.data.data.support_number || "";
          const digitsOnly = String(raw).replace(/\D/g, "");
          setSupportNumber(digitsOnly);
          setSubscriptionStatus(res.data.data.subscription_status || "");
          setSupportNote(res.data.data.message || "");
        }
      } catch (e) {
        console.error("Failed to fetch support number:", e?.response?.data || e?.message || e);
      } finally {
        isMounted && setLoadingSupport(false);
      }
    };
    fetchSupport();
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  // === رسالة واتساب
  const defaultWAString = useMemo(() => {
    if (isAuthenticated) {
      // رسالة للطلاب المسجلين
      const base = "اهلا فريق دعم منصة الدلفين 💙 ، احتاج الي مساعدة";
      const phoneNumber = user?.phoneNumber ? `\nو رقم جوالي المسجل علي المنصة هو : ${user.phoneNumber}` : "";
      const suffix = subscriptionStatus ? `\nالحالة: ${subscriptionStatus}` : "";
      return encodeURIComponent(`${base}${phoneNumber}${suffix}`);
    } else {
      // رسالة للطلاب غير المسجلين
      return encodeURIComponent("اهلاً دعم منصة الدلفين، محتاج مساعدة 🙏");
    }
  }, [isAuthenticated, user?.phoneNumber, subscriptionStatus]);

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
    // اختياري: تقفل القائمة بعد الفتح
    setIsOpen(false);
  };

  // === فتح/غلق Chatwoot
  const toggleChatwoot = () => {
    if (isChatOpen) {
      if (window.$chatwoot?.hide) {
        window.$chatwoot.hide();
      } else {
        window.$chatwoot?.toggle?.();
      }
      setIsChatOpen(false);
    } else {
      if (window.$chatwoot?.show) {
        window.$chatwoot.show();
      } else {
        window.$chatwoot?.toggle?.();
      }
      setIsChatOpen(true);
    }
  };

  // 🟢 إغلاق عند الضغط خارج الحاوية أو ضغط Esc
  useEffect(() => {
    const handlePointerDown = (e) => {
      const el = wrapperRef.current;
      if (el && !el.contains(e.target)) {
        closeAll();
      }
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
  }, [isChatOpen]); // يعتمد على الحالة الحالية للشات

  // === تحديث نصف القطر عند تغيير حجم الشاشة
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

  const buttons = isAuthenticated
    ? [
        { icon: whatsapp, angle: -40, alt: "WhatsApp", onClick: openWhatsApp },
        { icon: LifeChat, angle: 10, alt: "LifeChat", onClick: toggleChatwoot, isChat: true },
      ]
    : [
        { icon: whatsapp, angle: -90, alt: "WhatsApp", onClick: openWhatsApp },
        { icon: youtube, angle: -50, alt: "YouTube", onClick: () => window.open("https://www.youtube.com/@Learnatdolphin", "_blank", "noopener,noreferrer") },
        { icon: snapchat, angle: -10, alt: "Snapchat", onClick: () => window.open("https://snapchat.com/t/CwY0kRTD", "_blank", "noopener,noreferrer") },
      ];

  return (
    <div
      ref={wrapperRef} 
      className={className ?? "fixed bottom-18 md:bottom-24 lg:bottom-24 right-0 z-50"}
    >
      <div className="relative w-18 h-18 mx-4 sm:mx-6">
        {/* الأزرار الفرعية */}
        {buttons.map((btn, i) => {
          const rad = (btn.angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          return (
            <button
              key={i}
              onClick={btn.onClick}
              title={btn.alt === "WhatsApp" && supportNote ? `${btn.alt} • ${supportNote}` : btn.alt}
              disabled={btn.alt === "WhatsApp" && loadingSupport}
              className={`absolute w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 focus:outline-0 rounded-full bg-orangedeep shadow-lg flex items-center justify-center cursor-pointer
                transition-all duration-300
                ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"}
                ${btn.alt === "WhatsApp" && loadingSupport ? "opacity-60 cursor-wait" : ""}
              `}
              style={{ transform: `translate(${isOpen ? -x : 0}px, ${isOpen ? y : 0}px)` }}
            >
              {btn.isChat && isChatOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <img src={btn.icon}  loading="lazy" alt={btn.alt} className="w-6 h-6" />
              )}
            </button>
          );
        })}

        {/* الزر الرئيسي */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="flex items-center justify-center w-15 h-15 md:w-20 md:h-20 bg-orangedeep rounded-full shadow-lg hover:bg-btnClicked focus:bg-[#BA7C28] cursor-pointer transition-transform duration-300 focus:outline-0 hover:scale-110 relative z-10"
          title="الدعم"
        >
          <img  loading="lazy" src={dolphinCallCenter} alt="Support" />
        </button>
      </div>
    </div>
  );
};

export default HomeSupportBtn;
