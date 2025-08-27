import { HomeSupportBtn } from "../../../components/layout";
import AddPackageBtn from "../../../components/ui/AddPackageBtn";
import { PackageCard } from "../components";
import { usePackages } from "../hooks/usePackages";
import notFoundPackages from "@/assets/images/notFoundPackages.png";
import { packageColorMap } from "../../../constants/packageColors";

import withAuth from "../../auth/hoc/withAuth";
const Packages = () => {
  const { items,loading} = usePackages();



    if (loading) return null;
  return (
    <div className="flex flex-col   justify-center items-center py-15 px-4">
      {items.length > 0 ? (
        <div className="flex flex-col gap-15 pt-20">
          {items.map((item) => {
            const colors = packageColorMap[item.id] || {
              borderColor: "#0077B6",
              starFill: "#0C78B9",
              kiteStroke: "red",
            };

            return (
              <PackageCard
                key={item.id}
                item={item}
                borderColor={colors.borderColor}
                starFill={colors.starFill}
                kiteStroke={colors.kiteStroke}
              />
            );
          })}
        </div>
      ) : (
        <div className="relative flex flex-col justify-center items-center gap-4">
          <img
            src={notFoundPackages}
            alt="notFoundPackages"
            className="w-full max-w-[450px] sm:max-w-[450px] md:max-w-[450px] lg:max-w-[450px] object-contain mx-auto pt-20"
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
const ProtectedComponent =withAuth(Packages)
export default ProtectedComponent;