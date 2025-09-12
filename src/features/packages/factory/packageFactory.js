import { packageStyles } from "@/constants/PACKAGES_STYLES";
import reading from "@/assets/packages/reading.svg";

export const packageFactory = (packageId) =>
  packageStyles[packageId] || { image: reading, bgColor: "#FFFFBB" };
