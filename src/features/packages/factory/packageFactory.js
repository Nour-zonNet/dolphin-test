// factory/packageFactory.js
import { packageStyles } from "@/constants/PACKAGES_STYLES";

export const  packageFactory = (packageId) => {
  return packageStyles[packageId] || {
    image: null,
    bgColor: "#EEEEEE", 
  };
};