import { packageStyles } from "@/constants/PACKAGES_STYLES";
import tooth from "@/assets/packages/tooth.svg";

export const packageFactory = (packageId) =>
  packageStyles[packageId] || { image: tooth, bgColor: "#0077B6" };
