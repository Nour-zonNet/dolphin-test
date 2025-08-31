import * as React from "react";
import {  XIcon } from "lucide-react";
import { FilterIcon, Search } from "../../../utils/icons";

const SearchFilterBar = ({
  packages,
  onFilterChange,
  placeholder = "استكشف ..",
//   filterOptions = {},
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState({
    instructor: "",
    group: "",
  });

  // Extract unique instructors and groups from packages
  const instructors = [...new Set(packages.map((pkg) => pkg.instructor))];
  const groups = [...new Set(packages.map((pkg) => pkg.group))];

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, selectedFilters);
  };

  // Handle filter selection
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterType]: value,
    };
    setSelectedFilters(newFilters);
    applyFilters(searchTerm, newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({ instructor: "", group: "" });
    setSearchTerm("");
    applyFilters("", { instructor: "", group: "" });
  };

  // Apply filters and notify parent component
  const applyFilters = (searchValue, filters) => {
    let filteredPackages = packages;

    // Apply search filter
    if (searchValue) {
      filteredPackages = filteredPackages.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          pkg.instructor.toLowerCase().includes(searchValue.toLowerCase()) ||
          pkg.group.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply instructor filter
    if (filters.instructor) {
      filteredPackages = filteredPackages.filter(
        (pkg) => pkg.instructor === filters.instructor
      );
    }

    // Apply group filter
    if (filters.group) {
      filteredPackages = filteredPackages.filter(
        (pkg) => pkg.group === filters.group
      );
    }

    // Notify parent component
    onFilterChange(filteredPackages);
  };

  return (
    <div className="px-4 sm:px-6 relative">
      <div className="flex w-full max-w-2xl mx-auto h-14 sm:h-16 items-center justify-between px-4 sm:px-6 py-2 my-4 sm:my-6 rounded-full border border-[#d9d9d9] bg-white shadow-sm">
        <div className="flex items-center gap-2 px-2 sm:px-4 flex-1">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="text-lg sm:text-xl text-neutral-700 outline-none border-none bg-transparent w-full"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                applyFilters("", selectedFilters);
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <XIcon className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
        <button
          className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full hover:bg-gray-100 relative"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          {(selectedFilters.instructor || selectedFilters.group) && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Filter Dropdown */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 bg-white border border-[#d9d9d9] rounded-lg shadow-lg mt-2 z-10 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">الفلاتر</h3>
            <div className="flex gap-2">
              {(selectedFilters.instructor || selectedFilters.group) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  مسح الكل
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدرس
              </label>
              <select
                value={selectedFilters.instructor}
                onChange={(e) =>
                  handleFilterChange("instructor", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">كل المدرسين</option>
                {instructors.map((instructor, index) => (
                  <option key={index} value={instructor}>
                    {instructor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المجموعة
              </label>
              <select
                value={selectedFilters.group}
                onChange={(e) => handleFilterChange("group", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">كل المجموعات</option>
                {groups.map((group, index) => (
                  <option key={index} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
