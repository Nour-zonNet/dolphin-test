import { HomeSupportBtn } from "../../../components/layout";
import AddPackageBtn from "../../../components/ui/AddPackageBtn";
import { PackageCard } from "../components";
import { usePackages } from "../hooks/usePackages";
import notFoundPackages from "@/assets/images/notFoundPackages.png";
const Packages = () => {
  const { items } = usePackages();
  return (
    <div className="flex flex-col  justify-center items-center py-15 px-4">
      {items.length > 0 ? (
        <div className="flex flex-col gap-6 pt-20">
         { items.map((item, index) =>
          <PackageCard key={index} item={item} />)}
        </div>
      ) : (
        <div className="relative flex flex-col justify-center items-center gap-4">
          <img
            src={notFoundPackages}
            alt="notFoundPackages"
            className="w-full max-w-[500px] sm:max-w-[500px] md:max-w-[500px] lg:max-w-[500px] object-contain mx-auto pt-20"
          />
          <div className=" ml-0 xs:ml-20">
            <AddPackageBtn />
          </div>
        </div>
      )}

      <HomeSupportBtn />
    
    </div>
  );
};

export default Packages;
