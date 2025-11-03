import { useDispatch } from "react-redux";
import { openModal, closeModal } from "@/store/modalSlice";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";

// Callback registry to store callbacks outside of Redux
const callbackRegistry = new Map();

export const useModal = () => {
  const dispatch = useDispatch();

  const openBuyPackageModal = (packageData = {}) => {
    dispatch(
      openModal({
        type: MODAL_TYPES.BUY_PACKAGE,
        props: { packageData },
      })
    );
  };

  const openDetailsModal = (packageDetails = {}) => {
    dispatch(
      openModal({
        type: MODAL_TYPES.DETAILS,
        props: { packageDetails },
      })
    );
  };

  const openConfirmModal = (modalData = {}, onConfirm) => {
    // Store callback in registry with a unique ID
    const callbackId = Date.now().toString();
    if (onConfirm) {
      callbackRegistry.set(callbackId, onConfirm);
    }

    dispatch(
      openModal({
        type: MODAL_TYPES.CONFIRM,
        props: {
          modalData,
          callbackId: onConfirm ? callbackId : null,
        },
      })
    );
  };

  const openChangeGroupModal = (groupData = {}, onConfirm) => {
    // Store callback in registry with a unique ID
    const callbackId = Date.now().toString();
    if (onConfirm) {
      callbackRegistry.set(callbackId, onConfirm);
    }

    dispatch(
      openModal({
        type: MODAL_TYPES.CHANGE_GROUP,
        props: {
          groupData,
          callbackId: onConfirm ? callbackId : null,
        },
      })
    );
  };

  const openReactivateModal = (subscriptionData = {}, onConfirm) => {
    // Store callback in registry with a unique ID
    const callbackId = Date.now().toString();
    if (onConfirm) {
      callbackRegistry.set(callbackId, onConfirm);
    }

    dispatch(
      openModal({
        type: MODAL_TYPES.REACTIVATE,
        props: {
          subscriptionData,
          callbackId: onConfirm ? callbackId : null,
        },
      })
    );
  };

  const openExtendPackageModal = (packageData = {}, onConfirm) => {
    // Store callback in registry with a unique ID
    const callbackId = Date.now().toString();
    if (onConfirm) {
      callbackRegistry.set(callbackId, onConfirm);
    }

    dispatch(
      openModal({
        type: MODAL_TYPES.EXTEND_PACKAGE,
        props: {
          packageData,
          callbackId: onConfirm ? callbackId : null,
        },
      })
    );
  };

  const openStatusModal = (
    type = MODAL_TYPES.SUCCESS,
    { title = "", message = "", onClose, onConfirm } = {}
  ) => {
    // Register onClose callback in registry to keep Redux serializable
    const onCloseId = onClose ? Date.now().toString() : null;
    if (onCloseId && onClose) {
      callbackRegistry.set(onCloseId, onClose);
    }

    // Register onConfirm callback in registry to keep Redux serializable
    const onConfirmId = onConfirm ? Date.now().toString() + "_confirm" : null;
    if (onConfirmId && onConfirm) {
      callbackRegistry.set(onConfirmId, onConfirm);
    }

    dispatch(
      openModal({
        type,
        props: { title, message, onCloseId, onConfirmId },
      })
    );
  };

  const openWeeklyScheduleModal = (scheduleData = {}) => {
    dispatch(
      openModal({
        type: MODAL_TYPES.WEEKLY_SCHEDULE,
        props: { ...scheduleData },
      })
    );
  };

  const openAvatarModal = (onSelect) => {
    // Store callback in registry with a unique ID
    const callbackId = Date.now().toString();
    if (onSelect) {
      callbackRegistry.set(callbackId, onSelect);
    }

    dispatch(
      openModal({
        type: MODAL_TYPES.AVATAR_MODAL,
        props: {
          callbackId: onSelect ? callbackId : null,
        },
      })
    );
  };

  const openAddBalanceModal = (onSubmit) => {
    // Store callback in registry with a unique ID
    const callbackId = Date.now().toString();
    if (onSubmit) {
      callbackRegistry.set(callbackId, onSubmit);
    }

    dispatch(
      openModal({
        type: MODAL_TYPES.ADD_BALANCE,
        props: {
          callbackId: onSubmit ? callbackId : null,
        },
      })
    );
  };

  const openAddCouponModal = (onSubmit, subscriptionId = null, forSubscription = false) => {
    // Store callback in registry with a unique ID
    const callbackId = Date.now().toString();
    if (onSubmit) {
      callbackRegistry.set(callbackId, onSubmit);
    }

    dispatch(
      openModal({
        type: MODAL_TYPES.ADD_COUPON,
        props: {
          callbackId: onSubmit ? callbackId : null,
          subscriptionId,
          forSubscription,
        },
      })
    );
  };

  const openTransactionDetailsModal = (transaction = {}) => {
    dispatch(
      openModal({
        type: MODAL_TYPES.TRANSACTION_DETAILS,
        props: { transaction },
      })
    );
  };

  const openCommentsModal = (subject = {}) => {
    dispatch(
      openModal({
        type: MODAL_TYPES.COMMENTS,
        props: { subject },
      })
    );
  };

  const openPerformanceChartModal = (subject = {}, period = "month") => {
    dispatch(
      openModal({
        type: MODAL_TYPES.PERFORMANCE_CHART,
        props: { subject, period },
      })
    );
  };

  const openSessionRatingModal = (sessions = [], onSubmit, onClose, onSkip) => {
    // Store callbacks in registry with unique IDs to keep Redux serializable
    const onSubmitId = onSubmit ? Date.now().toString() : null;
    const onCloseId = onClose ? Date.now().toString() + "_close" : null;
    const onSkipId = onSkip ? Date.now().toString() + "_skip" : null;
    
    if (onSubmitId && onSubmit) {
      callbackRegistry.set(onSubmitId, onSubmit);
    }
    if (onCloseId && onClose) {
      callbackRegistry.set(onCloseId, onClose);
    }
    if (onSkipId && onSkip) {
      callbackRegistry.set(onSkipId, onSkip);
    }

    dispatch(
      openModal({
        type: MODAL_TYPES.SESSION_RATING,
        props: {
          sessions,
          onSubmitId: onSubmitId,
          onCloseId: onCloseId,
          onSkipId: onSkipId,
        },
      })
    );
  };

  const openEmailRequiredModal = (onNavigateToProfile) => {
    // Store callback in registry with a unique ID
    const callbackId = onNavigateToProfile ? Date.now().toString() : null;
    if (onNavigateToProfile) {
      callbackRegistry.set(callbackId, onNavigateToProfile);
    }

    dispatch(
      openModal({
        type: MODAL_TYPES.EMAIL_REQUIRED,
        props: {
          callbackId: callbackId,
        },
      })
    );
  };

  const openGroupCompletionModal = () => {
    dispatch(
      openModal({
        type: MODAL_TYPES.GROUP_COMPLETION,
        props: {},
      })
    );
  };

  const openLevelsModal = () => {
    dispatch(
      openModal({
        type: MODAL_TYPES.LEVELS,
        props: {},
      })
    );
  };

  const openHowItWorksModal = () => {
    dispatch(
      openModal({
        type: MODAL_TYPES.HOW_IT_WORKS,
        props: {},
      })
    );
  };

  const openWithdrawModal = () => {
    dispatch(
      openModal({
        type: MODAL_TYPES.WITHDRAW,
        props: {},
      })
    );
  };

  const openShareModal = (shareData = {}) => {
    dispatch(
      openModal({
        type: MODAL_TYPES.SHARE,
        props: {
          referralCode: shareData.referralCode || "",
          shareMessage: shareData.shareMessage || "",
        },
      })
    );
  };

  // Function to execute and remove callback from registry
  const executeCallback = (callbackId, ...args) => {
    const callback = callbackRegistry.get(callbackId);
    if (callback) {
      callback(...args);
      callbackRegistry.delete(callbackId);
    }
  };

  const closeCurrentModal = () => {
    dispatch(closeModal());
  };

  return {
    openBuyPackageModal,
    openDetailsModal,
    openConfirmModal,
    openChangeGroupModal,
    openReactivateModal,
    openExtendPackageModal,
    openStatusModal,
    openWeeklyScheduleModal,
    openAvatarModal,
    openAddBalanceModal,
    openAddCouponModal,
    openTransactionDetailsModal,
    openCommentsModal,
    openPerformanceChartModal,
    openSessionRatingModal,
    openEmailRequiredModal,
    openGroupCompletionModal,
    openLevelsModal,
    openHowItWorksModal,
    openWithdrawModal,
    openShareModal,
    closeCurrentModal,
    executeCallback, // Export this for use in ModalManager
  };
};

// Export the callback registry for use in ModalManager
export { callbackRegistry };