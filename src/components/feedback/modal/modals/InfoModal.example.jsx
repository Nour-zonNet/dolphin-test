import { useDispatch } from "react-redux";
import { showModal, hideModal } from "@/store/modalSlice";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";

// React Hook Examples - Use these inside React components
export const useModalExamples = () => {
  const dispatch = useDispatch();

  // Example 1: Payment Method Selection
  const showPaymentMethodModal = () => {
    dispatch(showModal({
      type: MODAL_TYPES.INFO,
      props: {
        title: "Select Payment Method",
        description: "Choose your preferred payment method to continue with the subscription.",
        actions: [
          {
            label: "Credit Card",
            onClick: () => {
              console.log("Credit card selected");
              dispatch(hideModal());
            },
            className: "bg-blue-500 hover:bg-blue-600 text-white"
          },
          {
            label: "PayPal",
            onClick: () => {
              console.log("PayPal selected");
              dispatch(hideModal());
            },
            className: "bg-blue-600 hover:bg-blue-700 text-white"
          },
          {
            label: "Cancel",
            onClick: () => dispatch(hideModal()),
            className: "bg-gray-300 hover:bg-gray-400 text-gray-700"
          }
        ]
      }
    }));
  };

  // Example 2: Action Confirmation
  const showConfirmActionModal = (actionName, onConfirm) => {
    dispatch(showModal({
      type: MODAL_TYPES.INFO,
      props: {
        title: "Confirm Action",
        description: `Are you sure you want to ${actionName}? This action cannot be undone.`,
        actions: [
          {
            label: "Cancel",
            onClick: () => dispatch(hideModal()),
            className: "bg-gray-300 hover:bg-gray-400 text-gray-700"
          },
          {
            label: "Confirm",
            onClick: () => {
              onConfirm();
              dispatch(hideModal());
            },
            className: "bg-red-500 hover:bg-red-600 text-white"
          }
        ]
      }
    }));
  };

  // Example 3: Simple Info Modal
  const showSimpleInfoModal = (title, description) => {
    dispatch(showModal({
      type: MODAL_TYPES.INFO,
      props: {
        title,
        description,
        actions: [
          {
            label: "OK",
            onClick: () => dispatch(hideModal())
          }
        ]
      }
    }));
  };

  // Example 4: Custom Styled Modal
  const showCustomStyledModal = () => {
    dispatch(showModal({
      type: MODAL_TYPES.INFO,
      props: {
        title: "Custom Styled Modal",
        description: "This modal has custom styling applied.",
        className: "max-w-lg bg-gradient-to-br from-blue-50 to-indigo-100",
        actions: [
          {
            label: "Primary Action",
            onClick: () => {
              console.log("Primary action clicked");
              dispatch(hideModal());
            },
            className: "bg-indigo-600 hover:bg-indigo-700 text-white"
          },
          {
            label: "Secondary",
            onClick: () => dispatch(hideModal()),
            className: "bg-white border border-indigo-300 text-indigo-600 hover:bg-indigo-50"
          }
        ]
      }
    }));
  };

  return {
    showPaymentMethodModal,
    showConfirmActionModal,
    showSimpleInfoModal,
    showCustomStyledModal
  };
};

// Utility Functions - Use these anywhere by passing dispatch as parameter
export const createModalActions = (dispatch) => ({
  // Payment Method Selection
  showPaymentMethodModal: () => {
    dispatch(showModal({
      type: MODAL_TYPES.INFO,
      props: {
        title: "Select Payment Method",
        description: "Choose your preferred payment method to continue with the subscription.",
        actions: [
          {
            label: "Credit Card",
            onClick: () => {
              console.log("Credit card selected");
              dispatch(hideModal());
            },
            className: "bg-blue-500 hover:bg-blue-600 text-white"
          },
          {
            label: "PayPal",
            onClick: () => {
              console.log("PayPal selected");
              dispatch(hideModal());
            },
            className: "bg-blue-600 hover:bg-blue-700 text-white"
          },
          {
            label: "Cancel",
            onClick: () => dispatch(hideModal()),
            className: "bg-gray-300 hover:bg-gray-400 text-gray-700"
          }
        ]
      }
    }));
  },

  // Action Confirmation
  showConfirmActionModal: (actionName, onConfirm) => {
    dispatch(showModal({
      type: MODAL_TYPES.INFO,
      props: {
        title: "Confirm Action",
        description: `Are you sure you want to ${actionName}? This action cannot be undone.`,
        actions: [
          {
            label: "Cancel",
            onClick: () => dispatch(hideModal()),
            className: "bg-gray-300 hover:bg-gray-400 text-gray-700"
          },
          {
            label: "Confirm",
            onClick: () => {
              onConfirm();
              dispatch(hideModal());
            },
            className: "bg-red-500 hover:bg-red-600 text-white"
          }
        ]
      }
    }));
  },

  // Simple Info Modal
  showSimpleInfoModal: (title, description) => {
    dispatch(showModal({
      type: MODAL_TYPES.INFO,
      props: {
        title,
        description,
        actions: [
          {
            label: "OK",
            onClick: () => dispatch(hideModal())
          }
        ]
      }
    }));
  },

  // Custom Styled Modal
  showCustomStyledModal: () => {
    dispatch(showModal({
      type: MODAL_TYPES.INFO,
      props: {
        title: "Custom Styled Modal",
        description: "This modal has custom styling applied.",
        className: "max-w-lg bg-gradient-to-br from-blue-50 to-indigo-100",
        actions: [
          {
            label: "Primary Action",
            onClick: () => {
              console.log("Primary action clicked");
              dispatch(hideModal());
            },
            className: "bg-indigo-600 hover:bg-indigo-700 text-white"
          },
          {
            label: "Secondary",
            onClick: () => dispatch(hideModal()),
            className: "bg-white border border-indigo-300 text-indigo-600 hover:bg-indigo-50"
          }
        ]
      }
    }));
  }
});
