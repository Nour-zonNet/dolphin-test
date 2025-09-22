import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/layout";
import { Book, Group, Teacher } from "../../../utils/icons";
import { Card } from "../components/Card";
import SearchFilterBar from "../components/SearchFilterBar";
import { usePackages } from "../hooks/usePackages";
import { packageFactory } from "../factory/packageFactory";

const PackageContent = () => {
  const [filteredPackages, setFilteredPackages] = useState([]);
  const { mine } = usePackages();
  const navigate = useNavigate();

  // Sync packages when mine changes
  useEffect(() => {
    setFilteredPackages(mine || []);
  }, [mine]);

  // 🔹 Memoize package cards to avoid recalculating every render
  const packageCards = useMemo(() => {
    return filteredPackages.map((packageItem, index) => {
      const pkgFactory = packageFactory(packageItem.id); // memoization helps if heavy

      return (
        <Card
          key={packageItem.id || index}
          className="w-full rounded-2xl overflow-hidden border border-bordercolor/30 "
        >
          <div className="flex flex-row">
            {/* Image Section */}
            <div
              style={{ backgroundColor: pkgFactory.bgColor }}
              className="w-30 md:w-40 lg:w-56 flex items-center justify-center p-4"
            >
              <img
                className={`max-w-full object-contain ${
                  index === 0 ? "w-20" : "w-20"
                }`}
                alt={packageItem.package_name}
                src={pkgFactory.image}
              />
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
              <h2 className="font-semibold text-black text-sm md:text-lg sm:text-xl mb-3 sm:mb-4">
                {packageItem.package_name}
              </h2>

              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex sm:flex-row gap-3 sm:gap-10">
                  {/* Instructor */}
                  {packageItem.instructor && (
                    <div className="flex items-center gap-2 text-nowrap sm:gap-4 justify-start">
                      <Teacher className="w-4 sm:w-5" />
                      <div className="font-semibold text-xs sm:text-base md:text-lg">
                        {packageItem.instructor}
                      </div>
                    </div>
                  )}

                  {/* Group */}
                  <div className="flex items-center gap-2 sm:gap-4 justify-start">
                    <Group className="w-4 h-4 sm:w-6 sm:h-6 text-foundation-bluenormal-active flex-shrink-0" />
                    <div className="font-semibold text-nowrap text-xs sm:text-base md:text-lg">
                      {packageItem.group_name}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {/* <div className="flex justify-end">
                  <button
                    onClick={() =>
                      navigate("/show-lessons/"+ packageItem.package_id)
                    }
                    aria-label={`عرض الدروس الخاصة بباقة ${packageItem.package_name}`}
                    className="text-xs  md:text-lg flex items-center gap-2 px-3 sm:px-4 py-2 bg-orangedeep hover:bg-foundationorangenormal-hover rounded-3xl text-deepnavy font-semibold sm:text-base"
                  >
                    <Book className="w-4 h-4 sm:w-6 sm:h-6" />
                    عرض الدروس
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </Card>
      );
    });
  }, [filteredPackages, navigate]); // recompute only when data changes

  return (
    <div className="min-h-screen bg-white flex flex-col mb-10">
      {/* Header */}
      <Header showArrow={false} title="محتوى الباقات" />
      <div className="px-4 sm:px-6 md:px-8 ">
        {/* Search Bar */}
        <SearchFilterBar
          packages={mine || []}
          onFilterChange={setFilteredPackages}
          placeholder="ابحث عن باقة..."
        />

        {/* Package Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 mb-8 ">
          {packageCards}
        </div>
      </div>
    </div>
  );
};

export default PackageContent;
