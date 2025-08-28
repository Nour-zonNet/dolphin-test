// factory/packageFactory.js
import { packageStyles } from "@/constants/packageStyles";

export const  packageFactory = (packageId) => {
  return packageStyles[packageId] || {
    image: null,
    bgColor: "#EEEEEE", // default style
  };
};