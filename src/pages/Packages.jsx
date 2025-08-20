import React from "react";
import PackageCard from "../components/cards/PackageCard";

// Import your images
import HealthIcon from "../assets/packages/health.svg";
import QuranIcon from "../assets/packages/quran.svg";
import EnglishIcon from "../assets/packages/english-letters.svg";

const Packages = () => {
  const cards = [
    {
      title: "باقة الصحة العامة",
      description: "",
      color: "bg-health",
      image: HealthIcon,
      group: "المجموعة العامة",
      status: "فعالة"
    },
    {
      title: "باقة ركن المسلم",
      description: "",
      color: "bg-quran",
      image: QuranIcon,
      group: "المجموعة العامة",
      status: "فعالة"
    },
    {
      title: "باقة تأسيس اللغة الإنجليزية ",
      description: "(المستوي الأول)",
      color: "bg-englishLevelOne",
      image: EnglishIcon,
      group: "المجموعة العامة",
      status: "فعالة"
    },
  ];

  return (
    <div className="flex flex-col gap-17">
      {cards.map((card, index) => (
        <PackageCard
          key={index}
          title={card.title}
          description={card.description}
          color={card.color}
          image={card.image}
          group={card.group}
          status={card.status}
        />
      ))}
    </div>
  );
};

export default Packages;