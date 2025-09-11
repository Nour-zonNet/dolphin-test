import { useLanguageDirection } from "@/hooks/useLanguageDirection";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

        <AppRoutes />

        {/* Toast notifications */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={true} 
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </AppProviders>
  );
};

export default App;
