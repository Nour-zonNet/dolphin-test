import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Header from "@/components/layout/Header";
import { LeftArrowFilled, SupportIcon, WalletStatus, Retry } from "@/utils/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import successImg from "@/assets/images/successModal.svg";
import warningImg from "@/assets/images/paymentFailed.svg";
import pendingImg from "@/assets/images/paymentPending.svg";
import HomeSupportBtn from "@/components/layout/HomeSupportBtn";
import { setLastTransaction } from "@/store/balanceSlice";
import FormatWithCurrency from "@/utils/FormatWithCurrency";
import { usePackages } from "@/features/packages/hooks/usePackages";

const RENEWAL_STATUS_CONFIG = {
  success: {
    renewal: {
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
    payment: {
      title: "نجاح الدفع",
      heading: "تم الدفع بنجاح",
      message: "تم دفع الباقات المختارة بنجاح ويمكنك الآن الاستمتاع بخدماتنا",
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
          label: "معاينة الرصيد",
          iconType: "WalletStatus",
          iconProps: { fill: "#0C2D40" },
          variant: "outline",
          to: "/balance-details",
        },
      ],
    },
  },
  failed: {
    renewal: {
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
    payment: {
      title: "فشل الدفع",
      heading: "فشل دفع الباقات",
      message: "لم نتمكن من معالجة عملية دفع الباقات المختارة",
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
  },
  pending: {
    renewal: {
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
    payment: {
      title: "الدفع معلق",
      heading: "عملية دفع الباقات قيد المعالجة",
      message: "نحن نتحقق من عملية الدفع، قد يستغرق الأمر بضع دقائق",
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
  },
  insufficient_balance: {
    renewal: {
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
    payment: {
      title: "رصيد غير كافي",
      heading: "رصيد غير كافي للدفع",
      message: "رصيدك الحالي غير كافي لإتمام عملية دفع الباقات المختارة",
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

// Package Summary Component
const PackageSummary = ({ packages, totalAmount: _totalAmount, discount = 0 }) => {
  const subtotal = packages.reduce((sum, pkg) => sum + (pkg.finalPrice || 0), 0);
  const finalTotal = subtotal - discount;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-center text-gray-800 mb-6">ملخص الطلب</h3>
      
      <div className="space-y-3 mb-4">
        {packages.map((pkg, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-800 text-sm">{pkg.name || `باقة ${index + 1}`}</span>
            <div className="flex items-center gap-1">
              <FormatWithCurrency
                amount={pkg.finalPrice || 0}
                fractionDigits={0}
                useGrouping={false}
                className="text-gray-800 text-sm"
                symbolClass="w-3 h-3"
                symbolFill="#185A80"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-300 pt-3 space-y-2">
        {discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-orange-600 text-sm">الخصم</span>
            <div className="flex items-center gap-1">
              <FormatWithCurrency
                amount={-discount}
                fractionDigits={0}
                useGrouping={false}
                className="text-orange-600 text-sm"
                symbolClass="w-3 h-3"
                symbolFill="#ea580c"
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-gray-800 font-semibold">الإجمالي</span>
          <div className="flex items-center gap-1">
            <FormatWithCurrency
              amount={finalTotal}
              fractionDigits={0}
              useGrouping={false}
              className="text-gray-800 font-semibold"
              symbolClass="w-4 h-4"
              symbolFill="#185A80"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const RenewalStatus = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, type } = useParams(); // Add type parameter from URL
  const { all: allPackages } = usePackages();
  const [transactionData, setTransactionData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [packageData, setPackageData] = useState([]);
  
  // Determine transaction type and get appropriate config
  const getTransactionType = (data, urlType) => {
    // Highest priority: URL parameter (if provided by backend)
    if (urlType === 'payment' || urlType === 'renewal') {
      return urlType;
    }
  
    // No data available - use advanced fallback detection
    if (!data) {
      // Check referrer to determine the source
      const referrer = document.referrer;
      
      // If coming from checkout page, it's likely a payment
      if (referrer && (referrer.includes('/checkout') || referrer.includes('/main-packages'))) {
        return 'payment';
      }
      
      // If coming from manage-subscription page, it's likely a renewal
      if (referrer && referrer.includes('/manage-subscription')) {
        return 'renewal';
      }
      
      // Check if there are any other indicators in localStorage/sessionStorage
      const checkoutData = sessionStorage.getItem('checkoutData') || localStorage.getItem('checkoutData');
      const renewalData = sessionStorage.getItem('renewalData') || localStorage.getItem('renewalData');
      
      // Prioritize renewal data over checkout data
      if (renewalData) {
        return 'renewal';
      }
      
      if (checkoutData && !renewalData) {
        return 'payment';
      }
      
      // Default fallback to renewal
      return 'renewal';
    }
  
    // Second priority: Explicit type field from transaction data (most reliable)
    if (data.type === 'payment' || data.type === 'renewal') {
      return data.type;
    }
  
    // Third priority: If subscriptionId exists → renewal (strong indicator)
    if (data.subscriptionId) return 'renewal';
  
    // Fourth priority: Check data structure patterns
    // Payment transactions from checkout have packageIds array (1 or more packages)
    if (Array.isArray(data.packageIds) && data.packageIds.length > 0) {
      return 'payment';
    }
  
    // Fifth priority: Renewal transactions from manage-subscription have single packageId
    if (data.packageId && (!data.packageIds || !Array.isArray(data.packageIds) || data.packageIds.length === 0)) {
      return 'renewal';
    }
  
    // Default fallback
    return 'renewal';
  };
  
  
  const transactionType = getTransactionType(transactionData, type);
  const data = RENEWAL_STATUS_CONFIG[status]?.[transactionType];

  // Debug: Check what's happening with detection (removed in production)

  useEffect(() => {
    // Get transaction data from sessionStorage or localStorage
    const sessionTransaction = sessionStorage.getItem('currentTransaction');
    const localTransaction = localStorage.getItem('pendingTransaction');
    
    let parsedTransaction = null;
    
    try {
      if (sessionTransaction) {
        parsedTransaction = JSON.parse(sessionTransaction);
      } else if (localTransaction) {
        parsedTransaction = JSON.parse(localTransaction);
      }
    } catch (error) {
      // Error parsing transaction data
    }
    
    if (parsedTransaction) {
      setTransactionData(parsedTransaction);
    }
  }, []);

  useEffect(() => {
    // Fetch package data for both payment and renewal transactions
    let packageIds = [];
    let packages = [];
    
    // Extract package IDs from transaction data
    if (transactionData) {
      if (transactionData.packageIds && Array.isArray(transactionData.packageIds)) {
        // Payment transactions have packageIds array (from checkout)
        packageIds = transactionData.packageIds;
      } else if (transactionData.packageId) {
        // Renewal transactions have single packageId (from manage-subscription)
        packageIds = [transactionData.packageId];
      }
    } else {
      // Fallback: Try to get package IDs from stored indicators
      const checkoutData = sessionStorage.getItem('checkoutData');
      const renewalData = sessionStorage.getItem('renewalData');
      
      if (checkoutData) {
        try {
          const parsed = JSON.parse(checkoutData);
          if (parsed.packageIds && Array.isArray(parsed.packageIds)) {
            packageIds = parsed.packageIds;
          }
        } catch (e) {
          // Error parsing checkout data
        }
      } else if (renewalData) {
        try {
          const parsed = JSON.parse(renewalData);
          if (parsed.packageId) {
            packageIds = [parsed.packageId];
          }
        } catch (e) {
          // Error parsing renewal data
        }
      }
    }
    
    if (packageIds.length > 0) {
       // Find packages in allPackages
       if (allPackages?.length > 0) {
         const numericPackageIds = packageIds.map(id => Number(id));
         
         packages = allPackages.filter(pkg => 
           numericPackageIds.includes(Number(pkg.id))
         );
       }
       
       // If packages not found, create fallback with real names if possible
       if (packages.length === 0) {
         
         const transactionAmount = transactionData?.amount || 0;
         const pricePerPackage = transactionAmount > 0 && packageIds.length > 0 
           ? transactionAmount / packageIds.length 
           : 129;
         
         packages = packageIds.map(id => {
           const existingPackage = allPackages?.find(pkg => Number(pkg.id) === Number(id));
           return {
             id: id,
             name: existingPackage?.name || `الباقة ${id}`,
             type: 'paid',
             originalPrice: pricePerPackage,
             finalPrice: pricePerPackage,
             description: 'تم شراء هذه الباقة بنجاح'
           };
         });
       }
      
      setPackageData(packages);
    } else {
      setPackageData([]);
    }
  }, [transactionData, allPackages]);

  useEffect(() => {
    // Handle different renewal statuses
    if (status === 'success' && transactionData) {
      // Update transaction status
      dispatch(setLastTransaction({
        ...transactionData,
        status: 'success',
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
        verifiedAt: new Date().toISOString(),
      }));
      
      // Clear pending transaction
      localStorage.removeItem('pendingTransaction');
      sessionStorage.removeItem('currentTransaction');
    } else if (status === 'pending' && transactionData?.id) {
      // Payment is pending - in real implementation, this would be handled by webhook or polling
      setIsVerifying(true);
    } else if (status === 'insufficient_balance' && transactionData) {
      // Insufficient balance - update transaction status
      dispatch(setLastTransaction({
        ...transactionData,
        status: 'insufficient_balance',
        verifiedAt: new Date().toISOString(),
      }));
      
      // Clear pending transaction
      localStorage.removeItem('pendingTransaction');
      sessionStorage.removeItem('currentTransaction');
    }
  }, [status, transactionData, dispatch]);

  if (!data) {
    return (
      <div className="min-h-screen">
        <Header title="حالة غير معروفة" onBack="/profile" showBalanceSection={false} showArrow={false} />
        <div className="flex flex-col items-center px-4 py-8 gap-6 mt-14 md:mt-20 lg:mt-8">
          <div className="p-6 text-center text-red-500">
            <h2 className="text-xl font-semibold mb-4">حالة غير معروفة</h2>
            <p className="text-gray-600 mb-4">
              لم نتمكن من تحديد حالة المعاملة. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.
            </p>
            <button 
              onClick={() => navigate("/")} 
              className="px-6 py-2 bg-orangedeep text-white rounded-full hover:bg-btnClicked transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
        <HomeSupportBtn />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title={data.title} onBack="/profile" showBalanceSection={false} showArrow={false} />

      <div className="flex flex-col items-center px-4 py-8 gap-6 mt-14 md:mt-20 lg:mt-8">
       <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-20 w-full max-w-6xl mx-auto">
         <div className="flex-shrink-0">
           <img src={data.image} alt={data.title} className="w-full mx-auto" loading="lazy" />
         </div>
         
         {/* Package Summary for Both Payment and Renewal Transactions */}
         {/* {packageData.length > 0 && (
           <div className="flex-shrink-0 w-full lg:w-[300px] w-1/2 lg:w-1/2">
             <PackageSummary 
               packages={packageData} 
               totalAmount={transactionData?.amount || 0}
               discount={0} 
             />
           </div>
         )} */}
       </div>
        <div className="text-center mb-4 lg:mb-6">
          <h2 className="font-semibold md:text-3xl text-xl text-navyteal">{data.heading}</h2>
          <p className="font-semibold text-navyteal md:text-2xl text-lg mt-4">{data.message}</p>
          
          {/* Verification Status */}
          {isVerifying && (
            <div className="mt-4 p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-orangedeep border-t-transparent rounded-full animate-spin"></div>
                <span className="text-orangedeep font-semibold">
                  {transactionType === 'payment' ? 'جاري التحقق من حالة الدفع...' : 'جاري التحقق من حالة التجديد...'}
                </span>
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
