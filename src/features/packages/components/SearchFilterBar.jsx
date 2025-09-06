import * as React from "react";
import { XIcon } from "lucide-react";
import { FilterIcon, Search } from "../../../utils/icons";

const   SearchFilterBar = React.memo(({ packages, onFilterChange, placeholder = "استكشف .." }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isFiltersVisible, setIsFiltersVisible] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState({ instructor: "", group: "" });

  const instructors = React.useMemo(
    () => Array.from(new Set(packages.map((pkg) => pkg.instructor))).filter(Boolean),
    [packages]
  );

  const groups = React.useMemo(
    () => Array.from(new Set(packages.map((pkg) => pkg.group))).filter(Boolean),
    [packages]
  );

  const applyFilters = React.useCallback(
    (queryValue, filtersValue) => {
      const normalizedQuery = queryValue.trim().toLowerCase();
      let filtered = packages;

      if (normalizedQuery) {
        filtered = filtered.filter((pkg) => {
          const title = (pkg.title || "").toLowerCase();
          const instructor = (pkg.instructor || "").toLowerCase();
          const group = (pkg.group || "").toLowerCase();
          return (
            title.includes(normalizedQuery) ||
            instructor.includes(normalizedQuery) ||
            group.includes(normalizedQuery)
          );
        });
      }

      if (filtersValue.instructor) {
        filtered = filtered.filter((pkg) => pkg.instructor === filtersValue.instructor);
      }

      if (filtersValue.group) {
        filtered = filtered.filter((pkg) => pkg.group === filtersValue.group);
      }

      onFilterChange(filtered);
    },
    [packages, onFilterChange]
  );

  const handleSearchChange = React.useCallback(
    (event) => {
      const value = event.target.value;
      setSearchQuery(value);
      applyFilters(value, activeFilters);
    },
    [activeFilters, applyFilters]
  );

  const handleFilterChange = React.useCallback(
    (filterKey, value) => {
      setActiveFilters((previous) => {
        const next = { ...previous, [filterKey]: value };
        applyFilters(searchQuery, next);
        return next;
      });
    },
    [searchQuery, applyFilters]
  );

  const clearFilters = React.useCallback(() => {
    setActiveFilters({ instructor: "", group: "" });
    setSearchQuery("");
    applyFilters("", { instructor: "", group: "" });
  }, [applyFilters]);

  return (
    <div className="relative px-4">
      <div className="flex w-full mx-auto h-14 sm:h-16 items-center justify-between px-4 py-2 my-4 sm:my-6 rounded-full border border-[#d9d9d9] bg-white">
        <div className="flex items-center gap-2  flex-1">
          <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="text-lg sm:text-xl text-[#404040] outline-none border-none bg-transparent w-full"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                applyFilters("", activeFilters);
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <XIcon className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
        <button
          className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full hover:bg-gray-100 relative"
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        >
          <FilterIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          {(activeFilters.instructor || activeFilters.group) && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Filter Dropdown */}
      {isFiltersVisible && (
        <div className="absolute top-full left-0 right-0 bg-white border border-[#d9d9d9] rounded-lg shadow-lg mt-2 z-10 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">الفلاتر</h3>
            <div className="flex gap-2">
              {(activeFilters.instructor || activeFilters.group) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  مسح الكل
                </button>
              )}
              <button
                onClick={() => setIsFiltersVisible(false)}
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
                value={activeFilters.instructor}
                onChange={(e) => handleFilterChange("instructor", e.target.value)}
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
                value={activeFilters.group}
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
});

export default SearchFilterBar;
