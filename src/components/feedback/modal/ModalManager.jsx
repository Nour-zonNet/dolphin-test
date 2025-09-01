import { useSelector, useDispatch } from "react-redux";
import { hideModal } from "@/store/modalSlice";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";

import StatusModal from "./modals/StatusModal";
import InfoModal from "./modals/InfoModal";

const ModalManager = () => {
  const { type, props } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  if (!type) return null;

  const handleClose = () => dispatch(hideModal());

  let ModalContent = null;
  switch (type) {
    case MODAL_TYPES.SUCCESS:
    case MODAL_TYPES.WARNING:
    case MODAL_TYPES.ERROR:
      ModalContent = (
        <StatusModal type={type} {...props} onClose={handleClose} />
      );
      break;
    case MODAL_TYPES.INFO:
      ModalContent = (
        <InfoModal {...props} onClose={handleClose} />
      );
      break;

    default:
      return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {ModalContent}
    </div>
  );
};

export default ModalManager;
