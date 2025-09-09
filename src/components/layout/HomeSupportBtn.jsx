import { useEffect, useState } from "react";
import dolphinCallCenter from "@/assets/images/dolphin-call-center.svg";
import whatsapp from "@/assets/images/whatsapp.svg";
import telegram from "@/assets/images/telegram.svg";
import youtube from "@/assets/images/youtube.svg";
import snapchat from "@/assets/images/snapchat.svg";
import message from "@/assets/images/message.svg";
import { useAuth } from "@/features/auth/hooks/useAuth";

const HomeSupportBtn = ({ className }) => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [radius, setRadius] = useState(70);
  // const radius = 90; // distance from center

  const buttons = isAuthenticated 
  ? [
      { icon: whatsapp, angle: -90, alt: "WhatsApp" },
      { icon: telegram, angle: -40, alt: "Telegram" },
      { icon: message, angle: 10, alt: "Message" },
  ]
  : [
      { icon: whatsapp, angle: -90, alt: "WhatsApp" },
      { icon: telegram, angle: -50, alt: "Telegram" },
      { icon: youtube, angle: -10, alt: "YouTube" },
      { icon: snapchat, angle: 30, alt: "Snapchat" },
  ];

  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 640) {
        setRadius(70);
      } else if (window.innerWidth < 1024) {
        setRadius(90);
      } else {
        setRadius(100);
      }
    };
      updateRadius(); 
      window.addEventListener("resize", updateRadius);
      return () => window.removeEventListener("resize", updateRadius);
    }, []);

  return (
    <div className={className ?? "fixed bottom-18 md:bottom-24 lg:bottom-24 right-0 z-50"}>
      <div className="relative w-18 h-18 mx-4 sm:mx-6">
        {/* Extra buttons */}
        {buttons.map((btn, i) => {
          const rad = (btn.angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;

          return (
            <button
              key={i}
              className={`absolute w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 focus:outline-0 rounded-full bg-orangedeep shadow-lg flex items-center justify-center
                transition-all duration-300
                ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"}
              `}
              style={{
                transform: `translate(${isOpen ? -x : 0}px, ${isOpen ? y : 0}px)`,
              }}
            >
              <img src={btn.icon} alt={btn.alt} className="w-6 h-6" />
            </button>
          );
        })}

        {/* Main button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            flex items-center justify-center
            w-15 h-15 md:w-20 md:h-20
            bg-orangedeep
            rounded-full shadow-lg
            hover:bg-btnClicked focus:bg-[#BA7C28]
            cursor-pointer transition-transform duration-300 focus:outline-0
            hover:scale-110
            relative z-10
          "
        >
          <img src={dolphinCallCenter} alt="Support" />
        </button>
      </div>
    </div>
  );
};

export default HomeSupportBtn;
