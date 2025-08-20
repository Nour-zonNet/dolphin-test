import React from "react";
import LessonCard from "../components/cards/LessonCard";

// Import your images
import HealthIcon from "../assets/packages/health.svg";
import QuranIcon from "../assets/packages/quran.svg";
import EnglishIcon from "../assets/packages/english-letters.svg";
import ScheduleSlider from "../components/widget/ScheduleSlider";

const Packages = () => {
  const cards = [
    {
      title: "باقة الصحة العامة",
      description: "",
      color: "border-r-16 border-r-health",
      image: HealthIcon,
      group: "المجموعة الأولي",
      teacher: "أ. حنان"
    },
    {
      title: "باقة ركن المسلم",
      description: "",
      color: "border-r-16 border-r-quran",
      image: QuranIcon,
      group: "المجموعة الأولي",
      teacher: "أ. حنان"
    },
  ];

  return (
    <div className="flex flex-col gap-17">
      <ScheduleSlider />
      {cards.map((card, index) => (
        <LessonCard
          key={index}
          title={card.title}
          description={card.description}
          color={card.color}
          image={card.image}
          group={card.group}
          teacher={card.teacher}
        />
      ))}
    </div>
  );
};

export default Packages;