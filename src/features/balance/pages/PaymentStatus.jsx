import React from "react";
import Header from "@/components/layout/Header";
import { LeftArrowFilled, SupportIcon, WalletGray, Retry } from "@/utils/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import successImg from "@/assets/images/successModal.svg";
import warningImg from "@/assets/images/paymentFailed.svg";
import pendingImg from "@/assets/images/paymentPending.svg";
import HomeSupportBtn from "@/components/layout/HomeSupportBtn";
import FormatWithCurrency from "@/utils/FormatWithCurrency";

// Icon components
const BackToHomeIcon = <LeftArrowFilled className="w-4 h-4 md:w-6 md:h-6" color="#0C2D40" />;
const ViewBalanceIcon = <WalletGray fill="#0C2D40" />;
const RetryIcon = <Retry className="w-4 h-4 md:w-6 md:h-6" />;
const SupportIconComponent = <SupportIcon />;

// Order Summary Card Component
const OrderSummaryCard = () => {
  const orderItems = [
    { name: "باقة الصحة العامة", price: 200 },
    { name: "باقة ركن المسلم", price: 100 },
    { name: "باقة اللغة الانجليزية المستوي الاول", price: 300 },
    { name: "باقة التميز", price: 400 },
    { name: "باقة التميز", price: 700 },
  ];

  const discount = 500;
  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal - discount;

  return (
    <div className="bg-white border border-[#8C8C8C22] rounded-[24px] p-6 w-full">
      <h3 className="text-lg md:text-xl font-bold text-black mb-6">ملخص الطلب</h3>
      
      <div className="space-y-3 mb-4">
        {orderItems.map((item, index) => (
          <div key={index} className="flex justify-between gap-6 items-center">
            <span className="text-[#645C5C] font-medium text-sm md:text-lg">{item.name}</span>
            <FormatWithCurrency 
              amount={item.price} 
              symbolFill="#645C5C" 
              symbolClass="w-4 h-4 md:w-6 md:h-6"
              className="text-[#645C5C] font-medium"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-[#AE7426] font-medium text-sm md:text-lg">الخصم</span>
        <FormatWithCurrency 
          amount={-discount}
          symbolFill="#AE7426" 
          symbolClass="w-4 h-4 md:w-6 md:h-6"
          className="text-[#AE7426] font-medium"
        />
      </div>

      <div className="border-t border-dashed border-gray-300 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-navyteal font-bold text-base md:text-lg">الإجمالي</span>
          <FormatWithCurrency 
            amount={total} 
            symbolFill="#08233F" 
            symbolClass="w-4 h-4 md:w-6 md:h-6"
            className="text-navyteal font-bold text-lg"
          />
        </div>
      </div>
    </div>
  );
};

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
        icon: BackToHomeIcon,
        variant: "filled",
        onClick: (navigate) => navigate("/"),
      },
      {
        type: "link",
        label: "معاينة الرصيد",
        icon: ViewBalanceIcon,
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
        icon: RetryIcon,
        variant: "filled",
        onClick: () => window.history.back(),
      },
      {
        type: "button",
        label: "العودة للرئيسية",
        icon: BackToHomeIcon,
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
        icon: SupportIconComponent,
        variant: "filled",
        onClick: () => window.history.back(),
      },
      {
        type: "button",
        label: "العودة للرئيسية",
        icon: BackToHomeIcon,
        variant: "outline",
        onClick: (navigate) => navigate("/"),
      },
    ],
  },
};

// 🔹 helper for styles
const buttonClasses = (variant) => {
  const base =
    "text-base md:text-lg w-full md:w-[80%] mx-auto font-medium py-2 md:py-4 flex items-center justify-center gap-2 rounded-full transition-all font-semibold text-sm md:text-lg";
  const filled =
    "bg-orangedeep text-darkblue hover:bg-btnClicked focus:bg-btnClicked font-semibold text-sm md:text-lg";
  const outline =
    "bg-transparent text-navyteal border border-orangedeep hover:bg-orangedeep/10 font-semibold text-sm md:text-lg";

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
        {/* For success status, show image and card side by side */}
        {status === 'success' ? (
          <div className="flex flex-col lg:flex-row items-center justify-center w-full lg:gap-60 gap-10">
            <img src={data.image} alt={data.title} className="w-[40%] md:w-[30%] lg:w-[20%] h-auto" loading="lazy" />
            <div>
              <OrderSummaryCard />
            </div>
          </div>
        ) : (
          <img src={data.image} alt={data.title} className="w-[40%] md:w-[30%] lg:w-[20%] h-auto" loading="lazy" />
        )}

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
      <HomeSupportBtn />
    </div>
  );
};

export default PaymentStatus;
