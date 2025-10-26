import addPackageDolphin from "@/assets/images/add-packages-dolphin.svg";

const NAVBAR_HEIGHT = 64;
const MOBILE_BAR_HEIGHT = 56;

const EmptySubscriptions = () => {
  return (
    <div
      className="flex justify-center items-center mt-10 mr-6"
      style={{ height: `calc(60svh - ${NAVBAR_HEIGHT + MOBILE_BAR_HEIGHT}px)` }}
    >
      <img src={addPackageDolphin} alt="Add Packages" className="max-h-full w-auto object-contain" />
    </div>
  );
};

export default EmptySubscriptions;


