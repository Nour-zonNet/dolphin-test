// factory/packageFactory.js
import { packageStyles } from "@/constants/PACKAGES_STYLES";
import tooth from "@/assets/packages/tooth.svg";
export const packageFactory = (packageId) => {
  return (
    packageStyles[packageId] || {
      image: tooth,
      bgColor: "#0077b6",
    }
  );
};
