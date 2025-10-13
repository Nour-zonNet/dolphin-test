import React from "react";
import Header from "@/components/layout/Header";
import { LeftArrowFilled, SupportIcon, WalletGray } from "@/utils/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import successImg from "@/assets/images/successModal.svg";
import warningImg from "@/assets/images/paymentFailed.svg";
import pendingImg from "@/assets/images/paymentPending.svg";

const STATUS_CONFIG = {
  success: {
    title: "نجاح الدفع",
    heading: "تمت عملية الإيداع بنجاح",
    message: "تمت إضافة رصيدك بنجاح إلى المحفظة",
    image: successImg,
    actions: [
      {
        type: "button",
        label: "العودة للرئيسية",
        icon: <LeftArrowFilled color="#0C2D40" />,
        variant: "filled",
        onClick: (navigate) => navigate("/"),
      },
      {
        type: "link",
        label: "معاينة الرصيد",
        icon: <WalletGray fill="#0C2D40" />,
        variant: "outline",
        to: "/balance-details",
      },
    ],
  },
  failed: {
    title: "فشل الدفع",
    heading: "فشل الدفع",
    message: "لم نتمكن من معالجة عملية الدفع الخاصة بك",
    image: warningImg,
    actions: [
      {
        type: "button",
        label: "حاول مرة أخرى",
        variant: "filled",
        onClick: () => window.history.back(),
      },
      {
        type: "button",
        label: "العودة للرئيسية",
        icon: <LeftArrowFilled color="#0C2D40" />,
        variant: "outline",
        onClick: (navigate) => navigate("/"),
      },
    ],
  },
  pending: {
    title: "الدفع معلق",
    heading: "عملية الدفع قيد المعالجة",
    message: "نحن نتحقق من الدفع، قد يستغرق الأمر بضع دقائق",
    image: pendingImg,
    actions: [
      {
        type: "button",
        label: "تواصل مع الدعم",
        icon: <SupportIcon />,
        variant: "filled",
        onClick: () => window.history.back(),
      },
      {
        type: "button",
        label: "العودة للرئيسية",
        icon: <LeftArrowFilled color="#0C2D40" />,
        variant: "outline",
        onClick: (navigate) => navigate("/"),
      },
    ],
  },
};

// 🔹 helper for styles
const buttonClasses = (variant) => {
  const base =
    "text-base md:text-lg w-full md:w-[80%] mx-auto font-medium py-2 md:py-4 flex items-center justify-center gap-2 rounded-full transition-all";
  const filled =
    "bg-orangedeep text-darkblue hover:bg-btnClicked focus:bg-btnClicked";
  const outline =
    "bg-transparent text-navyteal border border-orangedeep hover:bg-orangedeep/10";

  return `${base} ${variant === "filled" ? filled : outline}`;
};

const PaymentStatus = () => {
  const navigate = useNavigate();
  const { status } = useParams();
  const data = STATUS_CONFIG[status];

  if (!data) return <div className="p-6 text-center text-red-500">حالة غير معروفة</div>;

  return (
    <div className="min-h-screen">
      <Header title={data.title} onBack="/profile" showBalanceSection={false} showArrow={false} />

      <div className="flex flex-col items-center px-4 py-8 gap-6 mt-14 md:mt-20 lg:mt-8">
        <img src={data.image} alt={data.title} className="w-[40%] md:w-[30%] lg:w-[20%] h-auto" loading="lazy" />

        <div className="text-center mb-4 lg:mb-6">
          <h2 className="font-semibold md:text-3xl text-xl text-navyteal">{data.heading}</h2>
          <p className="font-semibold text-navyteal md:text-2xl text-lg mt-4">{data.message}</p>
        </div>

        {data.actions.map((a, i) =>
          a.type === "link" ? (
            <Link key={i} to={a.to} className={`${buttonClasses(a.variant)} lg:mt-4`}>
              {a.icon}
              <span>{a.label}</span>
            </Link>
          ) : (
            <button key={i} onClick={() => a.onClick(navigate)} className={`${buttonClasses(a.variant)} lg:mt-4`}>
              {a.icon}
              {a.label}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
