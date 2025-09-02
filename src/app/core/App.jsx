import { useLanguageDirection } from "@/hooks/useLanguageDirection";

// App Components
import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";

// Global Components
import GlobalLoader from "@/components/feedback/GlobalLoader";
import ModalManager from "@/components/feedback/modal/ModalManager";
// import { useModal } from "@/components/feedback/modal/useModal";

const App = () => {
  // Initialize language direction
  useLanguageDirection();

  // Modal hook for examples
  // const {
  //   openBuyPackageModal,
  //   openDetailsModal,
  //   openConfirmModal,
  //   openChangeGroupModal,
  //   openReactivateModal,
  //   openExtendPackageModal,
  // } = useModal();

  return (
    <AppProviders>
      <div className="app-container">
        {/* Global Components */}
        <GlobalLoader />
        <ModalManager />

        {/* Example Modal Buttons - Remove in production */}
        {/* <div className="fixed top-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg border">
          <h3 className="font-bold mb-3 text-sm">Modal Examples:</h3>
          <div className="space-y-2">
            <button 
              onClick={() => openBuyPackageModal({ 
                name: "باقة الصحة العامة",
                price: 129,
                duration: "6 أشهر",
                features: ["دروس يومية", "تمارين تفاعلية", "شهادة إتمام", "دعم فني"]
              })} 
              className="block w-full px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Buy Package Modal
            </button>
            <button 
              onClick={() => openDetailsModal({ 
                name: "باقة الصحة العامة",
                description: "باقة شاملة لصحة الأسنان والعناية بها",
                price: 129,
                duration: "6 أشهر",
                features: ["دروس يومية", "تمارين تفاعلية", "شهادة إتمام"]
              })} 
              className="block w-full px-3 py-2 text-xs bg-green-500 text-white rounded hover:bg-green-600"
            >
              Details Modal
            </button>
            <button 
              onClick={() => openConfirmModal({ 
                title: "تأكيد الحذف",
                message: "هل أنت متأكد من رغبتك في حذف هذا العنصر؟",
                confirmText: "حذف",
                cancelText: "إلغاء",
                type: "danger"
              }, () => console.log("Confirmed deletion"))} 
              className="block w-full px-3 py-2 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              Confirm Modal
            </button>
            <button 
              onClick={() => openChangeGroupModal({ 
                currentGroup: "المجموعة أ",
                availableGroups: ["المجموعة أ", "المجموعة ب", "المجموعة ج"]
              }, (groupId) => console.log("Changed to group:", groupId))} 
              className="block w-full px-3 py-2 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Change Group Modal
            </button>
            <button 
              onClick={() => openReactivateModal({ 
                subscriptionName: "باقة الصحة العامة",
                expiryDate: "2024-12-31",
                reactivationFee: 25
              }, () => console.log("Subscription reactivation requested"))} 
              className="block w-full px-3 py-2 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Reactivate Modal
            </button>
            <button 
              onClick={() => openExtendPackageModal({ 
                name: "باقة الصحة العامة",
                currentExpiry: "2024-12-31",
                extensionOptions: ["شهر واحد", "3 أشهر", "6 أشهر"]
              }, () => console.log("Package extension requested"))} 
              className="block w-full px-3 py-2 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Extend Package Modal
            </button>
          </div>
        </div> */}
        <AppRoutes />
      </div>
      </AppProviders>
  );
};



export default App;