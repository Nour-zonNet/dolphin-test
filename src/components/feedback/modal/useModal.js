import { useDispatch } from "react-redux";
import { openModal, closeModal } from "@/store/modalSlice";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";

// Callback registry to store callbacks outside of Redux
const callbackRegistry = new Map();

export const useModal = () => {
  const dispatch = useDispatch();

  const openBuyPackageModal = (packageData = {}) => {
    dispatch(openModal({
      type: MODAL_TYPES.BUY_PACKAGE,
      props: { packageData }
    }));
  };

  const openDetailsModal = (packageDetails = {}) => {
    dispatch(openModal({
      type: MODAL_TYPES.DETAILS,
      props: { packageDetails }
    }));
  };

  const openConfirmModal = (modalData = {}, onConfirm) => {
    // Store callback in registry with a unique ID
    const callbackId = Date.now().toString();
    if (onConfirm) {
      callbackRegistry.set(callbackId, onConfirm);
    }
    
    dispatch(openModal({
      type: MODAL_TYPES.CONFIRM,
      props: { 
        modalData,
        callbackId: onConfirm ? callbackId : null
      }
    }));
  };

  const openChangeGroupModal = (groupData = {}, onConfirm) => {
    // Store callback in registry with a unique ID
    const callbackId = Date.now().toString();
    if (onConfirm) {
      callbackRegistry.set(callbackId, onConfirm);
    }
    
    dispatch(openModal({
      type: MODAL_TYPES.CHANGE_GROUP,
      props: { 
        groupData,
        callbackId: onConfirm ? callbackId : null
      }
    }));
  };

  const openReactivateModal = (subscriptionData = {}, onConfirm) => {
    // Store callback in registry with a unique ID
    const callbackId = Date.now().toString();
    if (onConfirm) {
      callbackRegistry.set(callbackId, onConfirm);
    }
    
    dispatch(openModal({
      type: MODAL_TYPES.REACTIVATE,
      props: { 
        subscriptionData,
        callbackId: onConfirm ? callbackId : null
      }
    }));
  };

  const openExtendPackageModal = (packageData = {}, onConfirm) => {
    // Store callback in registry with a unique ID
    const callbackId = Date.now().toString();
    if (onConfirm) {
      callbackRegistry.set(callbackId, onConfirm);
    }
    
    dispatch(openModal({
      type: MODAL_TYPES.EXTEND_PACKAGE,
      props: { 
        packageData,
        callbackId: onConfirm ? callbackId : null
      }
    }));
  };

  const openStatusModal = (
    type = MODAL_TYPES.SUCCESS,
    { title = "", message = "", onClose } = {}
  ) => {
    // Register onClose callback in registry to keep Redux serializable
    const onCloseId = onClose ? Date.now().toString() : null;
    if (onCloseId && onClose) {
      callbackRegistry.set(onCloseId, onClose);
    }

    dispatch(openModal({
      type,
      props: { title, message, onCloseId }
    }));
  };

  const closeCurrentModal = () => {
    dispatch(closeModal());
  };

  // Function to execute and remove callback from registry
  const executeCallback = (callbackId, ...args) => {
    const callback = callbackRegistry.get(callbackId);
    if (callback) {
      callback(...args);
      callbackRegistry.delete(callbackId);
    }
  };

  return {
    openBuyPackageModal,
    openDetailsModal,
    openConfirmModal,
    openChangeGroupModal,
    openReactivateModal,
    openExtendPackageModal,
    openStatusModal,
    closeCurrentModal,
    executeCallback, // Export this for use in ModalManager
  };
};

// Export the callback registry for use in ModalManager
export { callbackRegistry };
