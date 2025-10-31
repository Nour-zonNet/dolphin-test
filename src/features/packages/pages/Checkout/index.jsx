import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSubscriptions } from "@/features/subscription/hooks/useSubscriptions";
import { useModal } from "@/components/feedback/modal/useModal";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";
import { getPackageIcon } from "./utils";
import { Header } from "../../../../components/layout";
import FormatWithCurrency from "@/utils/FormatWithCurrency";
import { getFormattedDate } from "../../../../utils/dateHelpers";
import { rechargePackagesFromWallet } from "@/services/api";
import myFatoorahIcon from "@/assets/packages/myfatoorah.png";
import { WalletGray } from "@/utils/icons";
import { initiateEmbeddedPayment } from "@/features/subscription/services/paymentEmbedded";
import EmbeddedPaymentModal from "@/components/feedback/modal/modals/EmbeddedPaymentModal";

export const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [discountApplied] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('myfatoorah'); // 'myfatoorah' or 'wallet'
  const { createTrialSubscription, fetchSubscriptions } = useSubscriptions();
  const { openStatusModal, openConfirmModal } = useModal();

  // Embedded payment state
  const [paymentFlow, setPaymentFlow] = useState({
    showEmbedded: false,
    sessionData: null,
    packageIds: null,
    packageName: null,
    loading: false,
  });

  const { selectedPackages = [] } = location.state || {};

  useEffect(() => {
    // Useful for debugging data coming from selector
  }, [selectedPackages]);

  const handleSubmitTrial = useCallback(async () => {
    try {
      await createTrialSubscription(
        selectedPackages.map((pkg) => ({
          package_id: pkg.id,
          start_date: null,
      }))
      );

      openStatusModal(MODAL_TYPES.SUCCESS, {
        title: "تم بدء الفترة التجريبية",
        message: "تم تفعيل الفترة التجريبية للباقات المختارة.",
        onClose: () => (window.location.href = "/schedule"),
      });
    } catch (error) {
      // Error creating trial subscription

      openStatusModal(MODAL_TYPES.ERROR, {
        title: "حدث خطأ",
        message: "لم نتمكن من تفعيل الفترة التجريبية، حاول مرة أخرى لاحقًا.",
      });
    }
  }, [createTrialSubscription, openStatusModal, selectedPackages]);

  const handlePay = useCallback(() => {
    if (!selectedPackages || selectedPackages.length === 0) {
      openStatusModal(MODAL_TYPES.ERROR, {
        title: "خطأ في البيانات",
        message: "لم يتم اختيار أي باقات للدفع.",
      });
      return;
    }

    const paymentMethodText = selectedPaymentMethod === 'wallet' ? 'المحفظة' : 'ماي فاتورة';
    
    openConfirmModal(
      {
        title: "تأكيد الدفع",
        message: `هل أنت متأكد من رغبتك في المتابعة مع الدفع للباقات المختارة عبر ${paymentMethodText}؟`,
        confirmText: "تأكيد الدفع",
        type: "primary",
      },
      async () => {
        setIsProcessingPayment(true);
        
        try {
          const packageIds = selectedPackages.map(pkg => pkg.id);
          
          if (selectedPaymentMethod === 'wallet') {
            // Handle wallet payment with comprehensive status handling
            try {
              const walletResult = await rechargePackagesFromWallet(packageIds);
              
              // Handle different status responses
              const handleWalletPaymentStatus = (result) => {
                // Extract status and message from various possible locations
                const status = result.status || result.data?.status || 'unknown';
                const message = result.message || result.data?.message || result.error || result.data?.error || '';
                const success = result.success !== undefined ? result.success : (result.data?.success !== undefined ? result.data.success : true);
                
                // Store transaction data based on status
                const paymentTransactionData = {
                  id: result.data?.transaction_id || result.transaction_id || 'wallet_payment_' + Date.now(),
                  amount: result.data?.amount || result.amount || 0,
                  currency: 'SAR',
                  status: success ? 'completed' : 'failed',
                  type: 'wallet_payment',
                  packageIds: packageIds,
                  paymentMethod: selectedPaymentMethod,
                  error: success ? null : message,
                  createdAt: new Date().toISOString(),
                };
                
                // Store transaction data
                sessionStorage.setItem('currentTransaction', JSON.stringify(paymentTransactionData));
                localStorage.setItem('pendingTransaction', JSON.stringify(paymentTransactionData));
                
                // Clear any conflicting renewal data
                sessionStorage.removeItem('renewalData');
                localStorage.removeItem('renewalData');
                
                const checkoutData = {
                  timestamp: Date.now(),
                  packageIds: packageIds,
                  paymentMethod: selectedPaymentMethod,
                  source: 'checkout',
                  status: success ? 'completed' : 'failed',
                  success: success
                };
                sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
                
                setIsProcessingPayment(false);
                
                // Handle success/failure first, then specific status cases
                if (success === false) {
                  // Handle failure cases with backend error message
                  openStatusModal(MODAL_TYPES.ERROR, {
                    title: "فشل في الدفع",
                    message: message || "فشل في الدفع من المحفظة. يرجى المحاولة مرة أخرى.",
                  });
                  return;
                }
                
                // Handle different success status cases
                switch (status.toLowerCase()) {
                  case 'success':
                  case 'completed':
                  case 'paid':
                    openStatusModal(MODAL_TYPES.SUCCESS, {
                      title: "تم الدفع بنجاح",
                      message: message || "تم تفعيل الباقات المختارة من المحفظة بنجاح.",
                      onClose: () => (window.location.href = "/schedule"),
                    });
                    break;
                    
                  case 'pending':
                  case 'processing':
                    openStatusModal(MODAL_TYPES.SUCCESS, {
                      title: "جاري المعالجة",
                      message: message || "تم إرسال طلب الدفع بنجاح. سيتم معالجة الطلب قريباً.",
                    });
                    break;
                    
                  case 'refunded':
                    openStatusModal(MODAL_TYPES.SUCCESS, {
                      title: "تم استرداد المبلغ",
                      message: message || "تم استرداد المبلغ إلى المحفظة بنجاح.",
                    });
                    break;
                    
                  default:
                    // Default success case
                    openStatusModal(MODAL_TYPES.SUCCESS, {
                      title: "تم الدفع بنجاح",
                      message: message || "تم تفعيل الباقات المختارة من المحفظة بنجاح.",
                      onClose: () => (window.location.href = "/schedule"),
                    });
                }
              };
              
              handleWalletPaymentStatus(walletResult);
              return;
              
            } catch (walletError) {
              setIsProcessingPayment(false);
              
              // Handle network/API errors
              const getWalletErrorMessage = (err) => {
                if (!err) return "حدث خطأ أثناء الدفع من المحفظة. حاول مرة أخرى.";
                
                // Handle string errors
                if (typeof err === "string") return err;
                
                // Handle axios error responses (HTTP 400, 500, etc.)
                if (err.response?.data) {
                  // Try different possible error message locations in the response
                  const errorData = err.response.data;
                  
                  // Check for error message in various possible locations
                  if (errorData.error && typeof errorData.error === 'string') return errorData.error;
                  if (errorData.message && typeof errorData.message === 'string') return errorData.message;
                  if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                    return errorData.errors[0];
                  }
                  if (errorData.details && typeof errorData.details === 'string') return errorData.details;
                  
                  // Check for nested error structures
                  if (errorData.data && typeof errorData.data === 'object') {
                    if (errorData.data.error) return errorData.data.error;
                    if (errorData.data.message) return errorData.data.message;
                  }
                  
                  // If response has a specific structure, try to extract meaningful message
                  if (typeof errorData === 'object') {
                    const errorKeys = Object.keys(errorData);
                    for (const key of errorKeys) {
                      if (typeof errorData[key] === 'string' && errorData[key].length > 0 && !key.includes('code')) {
                        return errorData[key];
                      }
                    }
                  }
                }
                
                // Handle error message property
                if (err.message) {
                  // If it's a generic axios message, try to extract more specific info
                  if (err.message.includes('Request failed with status code')) {
                    return "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.";
                  }
                  return err.message;
                }
                
                return "حدث خطأ أثناء الدفع من المحفظة. حاول مرة أخرى.";
              };
              
              // Store failed transaction data
              const failedTransactionData = {
                id: 'failed_wallet_payment_' + Date.now(),
                amount: 0,
                currency: 'SAR',
                status: 'failed',
                type: 'wallet_payment',
                packageIds: packageIds,
                paymentMethod: selectedPaymentMethod,
                error: getWalletErrorMessage(walletError),
                createdAt: new Date().toISOString(),
              };
              
              sessionStorage.setItem('currentTransaction', JSON.stringify(failedTransactionData));
              
              openStatusModal(MODAL_TYPES.ERROR, {
                title: "فشل في الدفع من المحفظة",
                message: getWalletErrorMessage(walletError),
              });
              return;
            }
          }
          
          // Handle MyFatoorah embedded payment
          setIsProcessingPayment(false);
          await handleEmbeddedPayment(packageIds);
        } catch (error) {
          setIsProcessingPayment(false);
          const getErrorMessage = (err) => {
            if (!err) return "حدث خطأ أثناء إنشاء طلب الدفع. حاول مرة أخرى.";
            if (typeof err === "string") return err;
            if (Array.isArray(err))
              return err[0] || "حدث خطأ أثناء إنشاء طلب الدفع. حاول مرة أخرى.";
            if (err && typeof err === "object") {
              if (err.data && err.data.error) return err.data.error;
              if (err.message) return err.message;
            }
            return "حدث خطأ أثناء إنشاء طلب الدفع. حاول مرة أخرى.";
          };
          openStatusModal(MODAL_TYPES.ERROR, {
            title: "فشل في إنشاء طلب الدفع",
            message: getErrorMessage(error),
          });
        }
      }
    );
  }, [openStatusModal, openConfirmModal, selectedPackages, selectedPaymentMethod]);

  // Handle embedded payment initiation
  const handleEmbeddedPayment = useCallback(async (packageIds) => {
    try {
      setPaymentFlow(prev => ({ ...prev, loading: true }));

      // Step 1: Initiate payment session
      const initiateResult = await initiateEmbeddedPayment(packageIds);
      
      if (!initiateResult.success || !initiateResult.data?.session_id) {
        throw new Error(initiateResult.message || "فشل في بدء جلسة الدفع");
      }

      // Get package names for display
      const packageNames = selectedPackages
        .filter(pkg => packageIds.includes(pkg.id))
        .map(pkg => pkg.name || pkg.package_name)
        .join(', ');

      // Store transaction data
      const transactionData = {
        id: `session_${initiateResult.data.session_id}`,
        amount: initiateResult.data.amount,
        currency: initiateResult.data.currency,
        status: 'pending',
        type: 'checkout',
        packageIds: packageIds,
        paymentMethod: 'myfatoorah_embedded',
        sessionId: initiateResult.data.session_id,
        createdAt: new Date().toISOString(),
      };
      
      sessionStorage.setItem('currentTransaction', JSON.stringify(transactionData));
      
      const checkoutData = {
        timestamp: Date.now(),
        packageIds: packageIds,
        paymentMethod: selectedPaymentMethod,
        source: 'checkout'
      };
      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));

      // Open embedded payment modal
      setPaymentFlow({
        showEmbedded: true,
        sessionData: initiateResult.data,
        packageIds,
        packageName: packageNames || 'الباقات المختارة',
        loading: false,
      });

    } catch (error) {
      setPaymentFlow(prev => ({ ...prev, loading: false }));
      
      const getErrorMessage = (err) => {
        if (!err) return "حدث خطأ أثناء إنشاء طلب الدفع. حاول مرة أخرى.";
        if (typeof err === "string") return err;
        if (err.response?.data) {
          const errorData = err.response.data;
          if (errorData.error && typeof errorData.error === 'string') return errorData.error;
          if (errorData.message && typeof errorData.message === 'string') return errorData.message;
          if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
            return errorData.errors[0];
          }
        }
        if (err.message) return err.message;
        return "حدث خطأ أثناء إنشاء طلب الدفع. حاول مرة أخرى.";
      };

      openStatusModal(MODAL_TYPES.ERROR, {
        title: "فشل في إنشاء طلب الدفع",
        message: getErrorMessage(error),
      });
    }
  }, [selectedPackages, selectedPaymentMethod, openStatusModal]);

  // Handle embedded payment completion
  const handleEmbeddedPaymentComplete = useCallback(async (result) => {
    setPaymentFlow({
      showEmbedded: false,
      sessionData: null,
      packageIds: null,
      packageName: null,
      loading: false,
    });

    if (result.cancelled) {
      return;
    }
    
    if (result.success) {
      // Fetch subscriptions to check if packages were updated
      await fetchSubscriptions();
      
      // Give backend time to process, then fetch again
      setTimeout(async () => {
        await fetchSubscriptions();
      }, 2000);
      
      openStatusModal(MODAL_TYPES.SUCCESS, {
        title: "تم الدفع بنجاح",
        message: result.verified !== false 
          ? "تم تفعيل الباقات المختارة بنجاح." 
          : "تم إتمام عملية الدفع. جاري تحديث حالة الاشتراك...",
        onClose: async () => {
          // Final refresh after user closes modal
          await fetchSubscriptions();
          navigate('/schedule');
        },
      });
    } else {
      openStatusModal(MODAL_TYPES.ERROR, {
        title: "فشل في الدفع",
        message: result.error || "فشل في إتمام عملية الدفع. يرجى المحاولة مرة أخرى.",
      });
    }
  }, [openStatusModal, fetchSubscriptions, navigate]);

  return (
    <div className="relative min-h-screen bg-white">
      <Header onBack={"/main-packages"} balance={0} title=" شراء الباقات" />

      <main className="container mx-auto  px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* <BalanceSummary /> */}
        <SelectedPackages selectedPackages={selectedPackages} />
        {/* <DiscountBar
          totalPrice={totalPrice}
          onApply={() => setDiscountApplied(true)}
        /> */}
        <Actions 
          onSubmitTrial={handleSubmitTrial} 
          onPay={handlePay} 
          isProcessingPayment={isProcessingPayment}
          selectedPaymentMethod={selectedPaymentMethod}
          onPaymentMethodChange={setSelectedPaymentMethod}
        />
      </main>

      {discountApplied && (
        <div className="fixed bottom-20 right-4 md:right-8 bg-green-100 text-green-800 px-4 py-2 rounded-lg  text-sm md:text-base text-center z-40">
          تم تفعيل كود الخصم بنجاح
        </div>
      )}

      {/* Embedded Payment Modal */}
      <EmbeddedPaymentModal
        open={paymentFlow.showEmbedded}
        onClose={handleEmbeddedPaymentComplete}
        sessionData={paymentFlow.sessionData}
        packageIds={paymentFlow.packageIds}
        packageName={paymentFlow.packageName || 'الباقات المختارة'}
      />
    </div>
  );
};

const BalanceSummary = () => (
  <div className="flex flex-col lg:flex-row  items-start lg:items-start  justify-between gap-6">
    <div className="relative w-50 sm:w-50 lg:w-40 xl:w-46 h-40 bg-gradient-to-br mx-auto from-blue-50 to-blue-100 rounded-2xl p-4">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          className="w-full h-full object-contain"
          alt="Vector"
          src="https://c.animaapp.com/mf3u5boioWZVpp/img/vector.svg"
        />
      </div>
      <div className="relative z-10">
        <div className="text-lg md:text-xl text-center md:text-right font-semibold text-black  mb-2">
          رصيد محفظتك
        </div>
        <div className="text-2xl md:text-3xl text-center  font-semibold text-subtext ">
          <FormatWithCurrency
            amount={1000}
            fractionDigits={0}
            useGrouping={false}
            className="flex items-center gap-1"
            symbolClass="w-4 h-4 md:w-6 md:h-6"
            symbolFill="#185A80"
          />
        </div>
      </div>
    </div>

    <div className="flex-1 space-y-3">
      <div className="flex items-center gap-2">
        <img
          className="w-5 h-5 md:w-6 md:h-6"
          alt="Info"
          src="https://c.animaapp.com/mf3u5boioWZVpp/img/frame-1.svg"
        />
        <div className="text-lg md:text-xl font-semibold text-normalblue ">
          رصيدك الحالي متاح للاستخدام
        </div>
      </div>
      <div className="flex items-center gap-2">
        <img
          className="w-5 h-5 md:w-6 md:h-6"
          alt="Group"
          src="https://c.animaapp.com/mf3u5boioWZVpp/img/group-1.png"
        />
        <p className="text-base md:text-lg font-semibold text-gray-500 ">
          مدة الفترة التجريبية: 1 أيام تجريبية مجانية
        </p>
      </div>
    </div>
  </div>
);

const SelectedPackages = ({ selectedPackages }) => {
  const navigate = useNavigate();
  if (!selectedPackages || selectedPackages.length === 0) {
    return (
      <div className="w-full bg-gray-50 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200  relative">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg md:text-2xl font-semibold text-normalblue   text-center">
            الباقات المختارة
          </h2>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-500  text-lg">
            لم يتم اختيار أي باقات. يرجى العودة لاختيار الباقات.
          </p>
          <button
            onClick={() => navigate("/main-packages")}
            className="mt-4 px-6 py-2 bg-orangedeep text-white rounded-full hover:bg-blue-700 transition-colors "
          >
            العودة لاختيار الباقات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 relative">
      <div className="p-4 md:p-6 ">
        <h2 className="text-lg md:text-2xl font-semibold text-normalblue   text-center">
          الباقات المختارة ({selectedPackages.length})
        </h2>
      </div>
      <div className="max-h-120 md:max-h-140 lg:max-h-96 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
          {selectedPackages.map((pkg, index) => (
            <React.Fragment key={pkg.id || index}>
              <PackageItem
                title={pkg.name || `باقة ${index + 1}`}
                price={
                  <FormatWithCurrency
                    amount={pkg.finalPrice || 0}
                    fractionDigits={0}
                    useGrouping={false}
                    className=" flex flex-row"
                    symbolClass="w-4 h-4 md:w-6 md:h-6"
                    symbolFill="#185A80"
                  />
                }
                icon={getPackageIcon(pkg.subjects)}
                showDatePicker={true}
              />
              {index < selectedPackages.length - 1 && (
                <div className="border-t border-gray-200 my-4"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <style>{`
        .overflow-y-auto::-webkit-scrollbar { width: 6px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
      `}</style>
    </div>
  );
};

const PackageItem = ({ title, icon, showDatePicker, status, price }) => (
  <div className="flex flex-col items-start justify-between gap-4">
    <div className="w-full flex flex-col  gap-3 justify-between ">
      <div className=" flex items-center gap-3 justify-start lg:justify-start">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-lg flex items-center justify-center">
          <img
            className="w-8 h-8 md:w-10 md:h-10 object-contain"
            alt="Package"
            src={icon}
          />
        </div>
        <div className=" lg:text-left">
          <div className=" font-semibold text-base text-gray-800">
            {title}
          </div>
        </div>
      </div>
      <div className="flex  gap-2">
        <p className=" font-semibold text-normalblue  text-md flex">
          <span className="ml-2"> سعر الباقة: </span>{" "}
          <span className="text-md">{price}</span>
        </p>
      </div>
    </div>
    <div className="w-full lg:w-auto">
      {showDatePicker ? (
        <div className="flex flex-col   gap-4">
          <div className=" font-semibold text-gray-800 text-sm md:text-base">
            موعد بداية الباقة:
          </div>
          <div className="flex-1 flex items-center gap-2 p-3 border border-gray-400 rounded-full">
            <img
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Calendar"
              src="https://c.animaapp.com/mf3u5boioWZVpp/img/frame-1410117192.svg"
            />
            <span className=" text-sm text-gray-700 flex-1 ">
              {getFormattedDate()}
              {/* السبت 09 -08 - 2025 */}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className=" font-semibold text-gray-800 text-sm md:text-base">
            اختر موعد بداية الباقة:
          </div>
          <div className="flex items-center gap-2 p-3 border border-gray-400 rounded-full">
            <span className=" text-sm text-orange-600">{status}</span>
            <img
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Calendar"
              src="https://c.animaapp.com/mf3u5boioWZVpp/img/frame-1410117192.svg"
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

const DiscountBar = ({ totalPrice, onApply }) => (
  <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white rounded-xl ">
    <div className="w-full">
      <div className="text-lg md:text-xl font-semibold text-gray-800  mb-4">
        هل لديك كود خصم؟
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <div className="flex items-center gap-3 p-2 px-4 border border-dashed border-blue-800 rounded-full">
            <img
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Apply"
              src="https://c.animaapp.com/mf3u5boioWZVpp/img/filled.svg"
            />
            <input
              type="text"
              placeholder="أدخل كود الخصم"
              className="flex-1  outline-none bg-transparent"
              defaultValue="hggg76789e"
            />
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={onApply}
            >
              <img
                className="w-5 h-5 md:w-6 md:h-6"
                alt="Discount"
                src="https://c.animaapp.com/mf3u5boioWZVpp/img/group.png"
              />
            </button>
          </div>
        </div>
        <div className="text-xl md:text-2xl flex gap-2 font-bold text-subtext ">
          {" "}
          <span>الاجمالى : </span>
          <FormatWithCurrency
            amount={totalPrice || 0}
            fractionDigits={0}
            useGrouping={false}
            className=" flex flex-row"
            symbolClass="w-4 h-4 md:w-6 md:h-6"
            symbolFill="#185A80"
          />
        </div>
      </div>
    </div>
  </div>
);

const PaymentMethodSelector = ({ selectedPaymentMethod, onPaymentMethodChange }) => (
  <div className="w-full mb-6">
    {/* <div className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center">
      اختر طريقة الدفع
    </div> */}
    <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full md:w-[70%] mx-auto mt-10">
      {/* Wallet Payment Option */}
      <div 
        className={`flex items-center p-4 rounded-full border-2 cursor-pointer transition-all flex-1 w-full ${
          selectedPaymentMethod === 'wallet' 
            ? 'border-orangedeep' 
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
        onClick={() => onPaymentMethodChange('wallet')}
      >
        <div className={`w-5 h-5 rounded-full border-2 me-2 ${
          selectedPaymentMethod === 'wallet' 
            ? 'border-orangedeep bg-orangedeep' 
            : 'border-gray-300'
        }`}>
          {selectedPaymentMethod === 'wallet' && (
            <div className="w-full h-full rounded-full bg-white scale-50"></div>
          )}
        </div>
        <div className="flex items-center gap-3 flex-1">
          <span className="text-base font-medium text-gray-800">
            الدفع من خلال المحفظة
          </span>
        </div>
        <WalletGray className="xl:w-8 xl:h-8 w-6 h-6" fill="#1B648E" />
      </div>

      {/* MyFatoorah Payment Option */}
      <div 
        className={`flex items-center p-3 rounded-full border-2 cursor-pointer transition-all flex-1 w-full ${
          selectedPaymentMethod === 'myfatoorah' 
            ? 'border-orangedeep' 
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
        onClick={() => onPaymentMethodChange('myfatoorah')}
      >
        <div className={`w-5 h-5 rounded-full border-2 me-2 ${
          selectedPaymentMethod === 'myfatoorah' 
            ? 'border-orangedeep bg-orangedeep' 
            : 'border-gray-300'
        }`}>
          {selectedPaymentMethod === 'myfatoorah' && (
            <div className="w-full h-full rounded-full bg-white scale-50"></div>
          )}
        </div>
        <div className="flex items-center gap-3 flex-1">
          {/* <span className="text-base font-medium text-gray-800">
            الدفع من خلال ماي فاتورة
          </span> */}
          <span className="text-sm font-medium text-gray-800 flex-1">ادفع الآن</span>
        </div>
        <img
          className="w-16"
          alt="Icon"
          src={myFatoorahIcon}
        />
      </div>
    </div>
  </div>
);

const Actions = ({ onSubmitTrial: _onSubmitTrial, onPay, isProcessingPayment, selectedPaymentMethod, onPaymentMethodChange }) => (
  <div className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8 mt-8">
    <PaymentMethodSelector 
      selectedPaymentMethod={selectedPaymentMethod}
      onPaymentMethodChange={onPaymentMethodChange}
    />
    <button
      onClick={onPay}
      disabled={isProcessingPayment}
      className={`flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-2 rounded-full text-navyteal font-semibold transition-colors cursor-pointer min-w-50 ${
        isProcessingPayment 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-orangedeep hover:bg-btnClicked'
      }`}
    >
      {isProcessingPayment ? (
        <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <img
          className="w-5 h-5 md:w-6 md:h-6"
          alt="Icon"
          src="https://c.animaapp.com/mf3u5boioWZVpp/img/left-2.png"
        />
      )}
      <span className=" text-base md:text-lg">
        {isProcessingPayment ? 'جاري المعالجة...' : 'ادفع الان'}
      </span>
    </button>
    {/* <button
      onClick={onSubmitTrial}
      className="flex items-center hover:cursor-pointer justify-center gap-2 w-full sm:w-auto px-6 py-2 border-2 border-orangedeep rounded-full text-deepbg-orangedeep font-semibold hover:bg-orange-50 transition-colors"
    >
      <img
        className="w-5 h-5 md:w-6 md:h-6"
        alt="Icon"
        src="https://c.animaapp.com/mf3u5boioWZVpp/img/frame.svg"
      />
      <span className=" text-base md:text-lg">
        بدء الفترة التجريبية
      </span>
    </button> */}
  </div>
);

export default Checkout;
