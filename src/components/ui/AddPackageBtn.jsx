import { Plus } from "../../utils/icons";

const AddPackageBtn = () => {
  return (
    <button className="flex items-center text-xs gap-2 bg-orangedeep text-darkblue font-medium px-4 sm:px-6 py-2 rounded-full hover:bg-btnClicked focus:bg-btnClicked cursor-pointer sm:text-sm">
      <Plus size={18} />
      <span className="text-base">اضافة باقة جديدة</span>
    </button>
  );
};

export default AddPackageBtn;
