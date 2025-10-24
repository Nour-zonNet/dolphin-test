import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Header from "@/components/layout/Header";
import { LeftArrowFilled, SupportIcon, WalletStatus, Retry } from "@/utils/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import successImg from "@/assets/images/successModal.webp";
import warningImg from "@/assets/images/paymentFailed.webp";
import pendingImg from "@/assets/images/paymentPending.webp";
import HomeSupportBtn from "@/components/layout/HomeSupportBtn";
import { setLastTransaction } from "@/store/balanceSlice";

const RENEWAL_STATUS_CONFIG = {
  success: {
    title: "نجاح التجديد",
    heading: "تم تجديد الاشتراك بنجاح",
    message: "تم تجديد اشتراكك بنجاح ويمكنك الآن الاستمتاع بخدماتنا",
    image: successImg,
    actions: [
      {
        type: "button",
        label: "العودة للرئيسية",
        iconType: "LeftArrowFilled",
        iconProps: { className: "w-4 h-4 md:w-6 md:h-6", color: "#0C2D40" },
        variant: "filled",
        onClick: (navigate) => navigate("/"),
      },
      {
        type: "link",
        label: "معاينة الاشتراكات",
        iconType: "WalletStatus",
        iconProps: { fill: "#0C2D40" },
        variant: "outline",
        to: "/manage-subscription",
      },
    ],
  },
  failed: {
    title: "فشل التجديد",
    heading: "فشل تجديد الاشتراك",
    message: "لم نتمكن من معالجة عملية تجديد الاشتراك الخاصة بك",
    image: warningImg,
    actions: [
      {
        type: "button",
        label: "حاول مرة أخرى",
        iconType: "Retry",
        iconProps: { className: "w-4 h-4 md:w-6 md:h-6" },
        variant: "filled",
        onClick: () => window.history.back(),
      },
      {
        type: "button",
        label: "العودة للرئيسية",
        iconType: "LeftArrowFilled",
        iconProps: { className: "w-4 h-4 md:w-6 md:h-6", color: "#0C2D40" },
        variant: "outline",
        onClick: (navigate) => navigate("/"),
      },
    ],
  },
  pending: {
    title: "التجديد معلق",
    heading: "عملية تجديد الاشتراك قيد المعالجة",
    message: "نحن نتحقق من عملية التجديد، قد يستغرق الأمر بضع دقائق",
    image: pendingImg,
    actions: [
      {
        type: "button",
        label: "تواصل مع الدعم",
        iconType: "SupportIcon",
        iconProps: {},
        variant: "filled",
        onClick: () => window.history.back(),
      },
      {
        type: "button",
        label: "العودة للرئيسية",
        iconType: "LeftArrowFilled",
        iconProps: { className: "w-4 h-4 md:w-6 md:h-6", color: "#0C2D40" },
        variant: "outline",
        onClick: (navigate) => navigate("/"),
      },
    ],
  },
  insufficient_balance: {
    title: "رصيد غير كافي",
    heading: "رصيد غير كافي للتجديد",
    message: "رصيدك الحالي غير كافي لإتمام عملية تجديد الاشتراك",
    image: warningImg,
    actions: [
      {
        type: "button",
        label: "إضافة رصيد",
        iconType: "WalletStatus",
        iconProps: { className: "w-4 h-4 md:w-6 md:h-6" },
        variant: "filled",
        onClick: (navigate) => navigate("/balance-details"),
      },
      {
        type: "button",
        label: "العودة للرئيسية",
        iconType: "LeftArrowFilled",
        iconProps: { className: "w-4 h-4 md:w-6 md:h-6", color: "#0C2D40" },
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

// 🔹 helper for creating icons dynamically
const createIcon = (iconType, iconProps = {}) => {
  const iconMap = {
    LeftArrowFilled,
    WalletStatus,
    Retry,
    SupportIcon,
  };
  
  const IconComponent = iconMap[iconType];
  if (!IconComponent) {
    return null;
  }
  
  return <IconComponent {...iconProps} />;
};

const RenewalStatus = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useParams();
  const [transactionData, setTransactionData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const data = RENEWAL_STATUS_CONFIG[status];

  useEffect(() => {
    // Get transaction data from sessionStorage or localStorage
    const sessionTransaction = sessionStorage.getItem('currentTransaction');
    const localTransaction = localStorage.getItem('pendingTransaction');
    
    if (sessionTransaction) {
      setTransactionData(JSON.parse(sessionTransaction));
    } else if (localTransaction) {
      setTransactionData(JSON.parse(localTransaction));
    }

    // Handle different renewal statuses
    if (status === 'success' && transactionData) {
      // For renewal success, we don't add balance - subscription is renewed
      // The renewal success is handled by the subscription service
      // No balance addition needed for subscription renewal
      
      // Update transaction status
      dispatch(setLastTransaction({
        ...transactionData,
        status: 'success',
        type: 'renewal',
        verifiedAt: new Date().toISOString(),
      }));
      
      // Clear pending transaction
      localStorage.removeItem('pendingTransaction');
      sessionStorage.removeItem('currentTransaction');
    } else if (status === 'failed' && transactionData) {
      // Payment failed, update transaction status
      dispatch(setLastTransaction({
        ...transactionData,
        status: 'failed',
        type: 'renewal',
        verifiedAt: new Date().toISOString(),
      }));
      
      // Clear pending transaction
      localStorage.removeItem('pendingTransaction');
      sessionStorage.removeItem('currentTransaction');
    } else if (status === 'pending' && transactionData?.id) {
      // Payment is pending - in real implementation, this would be handled by webhook or polling
      // For now, we'll just show the pending status
      setIsVerifying(true);
    } else if (status === 'insufficient_balance' && transactionData) {
      // Insufficient balance - update transaction status
      dispatch(setLastTransaction({
        ...transactionData,
        status: 'insufficient_balance',
        type: 'renewal',
        verifiedAt: new Date().toISOString(),
      }));
      
      // Clear pending transaction
      localStorage.removeItem('pendingTransaction');
      sessionStorage.removeItem('currentTransaction');
    }
  }, [status, transactionData, dispatch, navigate]);

  if (!data) return <div className="p-6 text-center text-red-500">حالة غير معروفة</div>;

  return (
    <div className="min-h-screen">
      <Header title={data.title} onBack="/profile" showBalanceSection={false} showArrow={false} />

      <div className="flex flex-col items-center px-4 py-8 gap-6 mt-14 md:mt-20 lg:mt-8">
        <img src={data.image} alt={data.title} className="w-[40%] md:w-[30%] lg:w-[20%] h-auto" loading="lazy" />

        <div className="text-center mb-4 lg:mb-6">
          <h2 className="font-semibold md:text-3xl text-xl text-navyteal">{data.heading}</h2>
          <p className="font-semibold text-navyteal md:text-2xl text-lg mt-4">{data.message}</p>
          
          {/* Verification Status */}
          {isVerifying && (
            <div className="mt-4 p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-orangedeep border-t-transparent rounded-full animate-spin"></div>
                <span className="text-orangedeep font-semibold">جاري التحقق من حالة التجديد...</span>
              </div>
            </div>
          )}
        </div>

        {data.actions.map((a, i) =>
          a.type === "link" ? (
            <Link key={i} to={a.to} className={`${buttonClasses(a.variant)} lg:mt-4`}>
              {createIcon(a.iconType, a.iconProps)}
              <span>{a.label}</span>
            </Link>
          ) : (
            <button key={i} onClick={() => a.onClick(navigate)} className={`${buttonClasses(a.variant)} lg:mt-4`}>
              {createIcon(a.iconType, a.iconProps)}
              {a.label}
            </button>
          )
        )}
      </div>
      <HomeSupportBtn />
    </div>
  );
};

export default RenewalStatus;
