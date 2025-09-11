import { useNavigate } from "react-router-dom";
import { Plus } from "../../utils/icons";

const AddPackageBtn = () => {
  const navigate = useNavigate();

  const handleAddPackage = () => navigate("/main-packages");

  return (
    <button
      onClick={handleAddPackage}
      className="flex items-center text-xs gap-2 bg-orangedeep text-darkblue font-medium px-4 sm:px-6 py-2 rounded-full hover:bg-btnClicked focus:bg-btnClicked cursor-pointer sm:text-sm"
    >
      <Plus size={18} />
      <span className="text-base">اضافة باقة </span>
    </button>
  );
};

export default AddPackageBtn;
