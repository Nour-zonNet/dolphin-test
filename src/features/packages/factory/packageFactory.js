import { packageStyles, getPackageStyleByTitle } from "@/constants/PACKAGES_STYLES";
import reading from "@/assets/packages/reading.svg";

// Legacy function for ID-based packages (backward compatibility)
export const packageFactory = (packageId) =>
  packageStyles[packageId] || { image: reading, bgColor: "#144b6b" };

// New function for title-based packages
export const packageFactoryWithTitle = (packageTitle) =>
  getPackageStyleByTitle(packageTitle)|| { image: reading, bgColor: "#144b6b" };

// Enhanced function that works with both ID and title
export const packageFactoryEnhanced = (packageData) => {
  // If packageData is a string (title), use title-based matching
  if (typeof packageData === 'string') {
    return getPackageStyleByTitle(packageData);
  }
  
  // If packageData is an object with package_name, use title-based matching
  if (packageData && packageData.package_name) {
    return getPackageStyleByTitle(packageData.package_name);
  }
  
  // If packageData is a number (ID), use ID-based matching
  if (typeof packageData === 'number') {
    return packageStyles[packageData] || { image: reading, bgColor: "#144b6b" };
  }
  
  // If packageData is an object with id, use ID-based matching
  if (packageData && packageData.id) {
    return packageStyles[packageData.id] || { image: reading, bgColor: "#144b6b" };
  }
  
  // Default fallback
  return { image: reading, bgColor: "#144b6b" };
};
