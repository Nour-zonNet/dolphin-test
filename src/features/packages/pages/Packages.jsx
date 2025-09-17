import AddPackageBtn from "../../../components/ui/AddPackageBtn";
import { PackageCard } from "../components";
import { usePackages } from "../hooks/usePackages";
import notFoundPackages from "@/assets/images/notFoundPackages.png";
import { InfoIcon } from "@/utils/icons";

import { packageFactory } from "../factory/packageFactory.js";
import { TelegramCircle } from "../../../utils/icons.jsx";

const Packages = () => {
  const { mine, loading, telegram } = usePackages();

  if (loading) return null;

  return (
    <div className="py-18 mt-10 md:py-18 px-4 sm:px-6 lg:px-10 lg:pt-30 ">
      {/* Warning */}
      <div className="flex flex-col sm:flex-row justify-between  items-start md:items-center gap-4 md:px-10 mt-3 lg:pr-0">
        {/* Info Section */}
        <div className="flex items-center gap-2 rounded-lg text-center sm:text-left">
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
            <InfoIcon fill="#185a80" />
          </div>
          <p className="text-subtext text-sm md:text-lg ">
            انضم لمجتمعنا على التيليجرام وتابع كل جديد
          </p>
        </div>

        {/* Button */}
        <div
           onClick={() => window.open(telegram, "_blank", "noopener,noreferrer")}

          className="w-full sm:w-auto"
        >
          <button className="border w-full sm:w-auto text-sm px-6 lg:text-base  sm:px-10 py-1 md:ml-7 md:py-2 flex items-center justify-center gap-2 rounded-full border-orangedeep hover:bg-orangedeep/10 transition">
            <TelegramCircle className="h-6" />
            <span className="whitespace-nowrap">انضم الآن</span>
          </button>
        </div>
      </div>

      {mine.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 py-8">
          {mine.map((pkg) => {
            const { image, bgColor } = packageFactory(pkg.package_id);
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
    </div>
  );
};

export default Packages;
