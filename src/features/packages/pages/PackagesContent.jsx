import { Book, Group, Teacher } from "../../../utils/icons";
import { Card } from "../components/Card";
import SearchFilterBar from "../components/SearchFilterBar";
import React from "react";
import { useNavigate } from "react-router-dom";

// Data
const packageData = [
  {
    id: 1,
    title: "باقة الصحة العامة",
    backgroundColor: "bg-[#0077b6]",
    image:
      "https://c.animaapp.com/mezbipdmunBbmz/img/adobe-express---file-2.png",
    instructor: "أ. حنان",
    group: "المجموعة الأولي",
  },
  {
    id: 2,
    title: "باقة ركن المسلم",
    backgroundColor: "bg-[#4CAF50]",
    image:
      "https://c.animaapp.com/mezbipdmunBbmz/img/adobe-express---file--3--1.png",
    instructor: "أ. حنان",
    group: "المجموعة الأولي",
  },
  {
    id: 3,
    title: "باقة ركن المسلم",
    backgroundColor: "bg-[#4CAF50]",
    image:
      "https://c.animaapp.com/mezbipdmunBbmz/img/adobe-express---file--3--1.png",
    instructor: "أ. محمود",
    group: "المجموعة الثانية",
  },
];

const PackageContent = () => {
  const [filteredPackages, setFilteredPackages] = React.useState(packageData);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col  ">
      {/* Status Bar */}

      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-2">
        <h1 className="text-center font-bold text-xl sm:text-2xl">
          محتوى الباقات
        </h1>
      </header>

      {/* Search Bar */}
      <SearchFilterBar
        packages={packageData}
        onFilterChange={setFilteredPackages}
        placeholder="ابحث عن باقة..."
      />

      {/* Package Cards */}
      <div className="flex flex-col   gap-4 sm:gap-6 mt-4 mb-8 px-4 sm:px-6">
        {filteredPackages.map((packageItem, index) => (
          <Card
            key={packageItem.id}
            className="w-full rounded-2xl overflow-hidden border border-[#8c8c8c] shadow-md"
          >
            <div className="flex flex-row">
              {/* Image Section */}
              <div
                className={`w-40 lg:w-56 h-48 ${packageItem.backgroundColor} flex items-center justify-center p-4`}
              >
                <img
                  className={`max-w-full max-h-32 object-contain ${
                    index === 0 ? "h-32" : "h-28"
                  }`}
                  alt={packageItem.title}
                  src={packageItem.image}
                />
              </div>

              {/* Content Section */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                <h2 className="font-semibold text-black text-lg sm:text-xl mb-3 sm:mb-4 ">
                  {packageItem.title}
                </h2>

                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row  gap-3 sm:gap-10">
                    <div className="flex items-center gap-2 sm:gap-4 justify-start sm:justify-start">
                      <Teacher className="w-5 h-5 sm:w-6 sm:h-6 text-foundation-bluenormal-active flex-shrink-0" />
                      <div className="font-semibold text-foundation-bluenormal-active text-base sm:text-lg">
                        {packageItem.instructor}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 justify-START sm:justify-start">
                      <Group className="w-5 h-5 sm:w-6 sm:h-6 text-foundation-bluenormal-active flex-shrink-0" />
                      <div className="font-semibold text-foundation-bluenormal-active text-base sm:text-lg">
                        {packageItem.group}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate("/show-lessons")}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-orangedeep hover:bg-foundationorangenormal-hover rounded-3xl text-deepnavy font-semibold text-sm sm:text-base"
                    >
                      <Book className="w-6 h-6 sm:w-8 sm:h-8" />
                      عرض الدروس
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default PackageContent;
