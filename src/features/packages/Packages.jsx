import { PackageCard } from "./components";

const Packages = () => {
  const cards = [
    {
      title: "باقة الصحة العامة",
      description: "",
      color: "bg-health",
      //   image: HealthIcon,
      group: "المجموعة العامة",
      status: "فعالة",
    },
    {
      title: "باقة ركن المسلم",
      description: "",
      color: "bg-quran",
      //   image: QuranIcon,
      group: "المجموعة العامة",
      status: "فعالة",
    },
    {
      title: "باقة تأسيس اللغة الإنجليزية ",
      description: "(المستوي الأول)",
      color: "bg-englishLevelOne",
      //   image: EnglishIcon,
      group: "المجموعة العامة",
      status: "فعالة",
    },
  ];

  return (
    <div className="flex flex-col gap-8  justify-center items-center py-20 px-4">
      {cards.map((item, index) => (
        <PackageCard key={index} item={item} />
      ))}
    </div>
  );
};

export default Packages;
