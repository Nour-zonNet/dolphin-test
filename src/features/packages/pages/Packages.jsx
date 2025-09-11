import { HomeSupportBtn } from "../../../components/layout";
import AddPackageBtn from "../../../components/ui/AddPackageBtn";
import { PackageCard } from "../components";
import { usePackages } from "../hooks/usePackages";
import notFoundPackages from "@/assets/images/notFoundPackages.png";

import { packageFactory } from "../factory/packageFactory.js";

const Packages = () => {
  const { mine, loading } = usePackages();

  if (loading) return null;

  return (

    <div className="py-18 mt-10 md:py-18 px-4 sm:px-6 lg:px-10 lg:pt-30 ">
      {mine.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 py-8">
          {mine.map((pkg) => {
            const { image, bgColor } = packageFactory(pkg.id);
            return (
              <PackageCard
                key={pkg.id}
                item={pkg}
                color={bgColor}
                image={image}
                status={pkg.status}
                daysRemaining={pkg.days_remaining}
              />
            );
          })}
        </div>
      ) : (
        <div className="relative flex flex-col justify-center mine-center gap-4 mt-10 mr-20">
          <img
            src={notFoundPackages}
            alt="notFoundPackages"

            className="w-full max-w-[300px] sm:max-w-[300px] md:max-w-[300px] lg:max-w-[300px] object-contain mx-auto "
          />
          <div className=" flex justify-center  ml-20 text-center xs:ml-20">
            <AddPackageBtn />
          </div>
        </div>
      )}

      <HomeSupportBtn className="fixed bottom-25 lg:bottom-24 right-0 z-50" />
    </div>
  );
};

export default Packages;
