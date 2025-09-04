import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "@/store/modalSlice";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";
import { callbackRegistry } from "./useModal";
import ModalContainer from "./ModalContainer";

import {
  StatusModal,
  BuyPackageModal,
  DetailsModal,
  ConfirmModal,
  ChangeGroupModal,
  ReactivateModal,
} from "./modals";

const ModalManager = () => {
  const { type, props } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  if (!type) return null;

  const handleClose = () => {
    // Execute registered onClose callback if provided via props
    if (props && props.onCloseId) {
      const cb = callbackRegistry.get(props.onCloseId);
      if (cb) {
        try { cb(); } finally { callbackRegistry.delete(props.onCloseId); }
      }
    }
    dispatch(closeModal());
  };

  // Helper function to execute callbacks from registry
  const executeCallback = (callbackId, ...args) => {
    const callback = callbackRegistry.get(callbackId);
    if (callback) {
      callback(...args);
      callbackRegistry.delete(callbackId);
    }
  };

  let ModalContent = null;
  switch (type) {
    case MODAL_TYPES.SUCCESS:
    case MODAL_TYPES.WARNING:
    case MODAL_TYPES.ERROR:
      ModalContent = (
        <StatusModal type={type} {...props} onClose={handleClose} />
      );
      break;
    case MODAL_TYPES.BUY_PACKAGE:
      ModalContent = (
        <BuyPackageModal {...props} onClose={handleClose} />
      );
      break;
    case MODAL_TYPES.DETAILS:
      ModalContent = (
        <DetailsModal {...props} onClose={handleClose} />
      );
      break;
    case MODAL_TYPES.CONFIRM:
      ModalContent = (
        <ConfirmModal 
          {...props} 
          onClose={handleClose}
          onConfirm={(data) => {
            if (props.callbackId) {
              executeCallback(props.callbackId, data);
            }
            handleClose();
          }}
        />
      );
      break;
    case MODAL_TYPES.CHANGE_GROUP:
      ModalContent = (
        <ChangeGroupModal 
          {...props} 
          onClose={handleClose}
          onConfirm={(groupId) => {
            if (props.callbackId) {
              executeCallback(props.callbackId, groupId);
            }
            handleClose();
          }}
        />
      );
      break;
    case MODAL_TYPES.REACTIVATE:
      ModalContent = (
        <ReactivateModal 
          {...props} 
          onClose={handleClose}
          onConfirm={(data) => {
            if (props.callbackId) {
              executeCallback(props.callbackId, data);
            }
            handleClose();
          }}
        />
      );
      break;
    case MODAL_TYPES.EXTEND_PACKAGE:
      ModalContent = (
        <BuyPackageModal 
          {...props} 
          onClose={handleClose}
          isExtendMode={true}
        />
      );
      break;
    default:
      return null;
  }

  return (
    <ModalContainer onClose={handleClose} labelledBy="modal-title">
      {ModalContent}
    </ModalContainer>
  );
};

export default ModalManager;
