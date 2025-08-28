import Card from "./Card";
import tooth from "@/assets/packages/tooth.svg";

export const Cards = () => {
      const subscriptions = [
    {
      id: 1,
      title: "بـاقة الصحة العامة",
      subject: "الصحة العامة",
      startDate: "29 أغسطس 2025",
      endDate: "18 سبتمبر 2025",
      group: "المجموعة 1",
      daysLeft: 1,
      icon: tooth,
    },
    {
      id: 2,
      title: "بـاقة الأسنان",
      subject: "طب الأسنان",
      startDate: "1 سبتمبر 2025",
      endDate: "20 أكتوبر 2025",
      group: "المجموعة 2",
      daysLeft: 15,
      icon: tooth,
    },
  ];
  return (
    <div className="w-[90%] mx-auto flex flex-col lg:flex-row gap-6 items-start mt-6 lg:mt-10">
      {subscriptions.map((sub) => (
        <Card
          key={sub.id}
          title={sub.title}
          icon={tooth}
          status={`فعالة (${sub.daysLeft} يوم متبقي)`}
          subject={sub.subject}
          startDate={sub.startDate}
          endDate={sub.endDate}
          group={sub.group}
          onUseCoupon={() => console.log("Use coupon", sub.id)}
          onChangeGroup={() => console.log("Change group", sub.id)}
          onCancel={() => console.log("Cancel subscription", sub.id)}
        />
      ))}
    </div>
  );
};

export default Cards