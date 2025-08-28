import React from "react";
import Card from "./Card";
import tooth from "@/assets/images/tooth.svg";
import letters from "@/assets/schedule/abc.svg";
import { DashedLine } from "../../../utils/Illustrations";

export const Cards = ({  }) => {
    const subscriptions = [
    {
      id: 1,
      title: "بـاقة الصحة العامة",
      subject: "الصحة العامة",
      startDate: "29 أغسطس 2025",
      endDate: "18 سبتمبر 2025",
      group: "المجموعة 1",
      daysLeft: 1,
      image: tooth,
      status: "فعالة"
    },
    {
      id: 2,
      title: "بـاقة الصحة العامة",
      subject: "الصحة العامة",
      startDate: "29 أغسطس 2025",
      endDate: "18 سبتمبر 2025",
      group: "المجموعة 1",
      daysLeft: 0,
      image: tooth,
      status: "منتهي"
    },
    {
      id: 3,
      title: "بـاقة الصحة العامة",
      subject: "اللغة الإنجليزية",
      startDate: "1 سبتمبر 2025",
      endDate: "20 أكتوبر 2025",
      group: "المجموعة 2",
      daysLeft: 2,
      image: tooth,
      status: "تجريبي"
    },
    {
      id: 4,
      title: "باقة تأسيس اللغة الإنجليزية (المستوي الأول)",
      subject: "اللغة الإنجليزية",
      startDate: "1 سبتمبر 2025",
      endDate: "20 أكتوبر 2025",
      group: "المجموعة 2",
      daysLeft: 2,
      image: letters,
      status: "ملغاة"
    },
  ];
  return (
   <div className="w-full grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-6 items-start mt-6 lg:mt-10">
      {subscriptions.map((sub, index) => (
        <div key={sub.id} className="w-full">
          <Card
            title={sub.title}
            image={sub.image}
            status={sub.status}
            subject={sub.subject}
            startDate={sub.startDate}
            endDate={sub.endDate}
            group={sub.group}
            onUseCoupon={() => console.log("Use coupon", sub.id)}
            onChangeGroup={() => console.log("Change group", sub.id)}
            onCancel={() => console.log("Cancel subscription", sub.id)}
          />
          {/* Add dashed line after each card except the last one */}
          {index !== subscriptions.length - 1 && (
            <div className="my-4">
              {/* <DashedLine /> */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Cards