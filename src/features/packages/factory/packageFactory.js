
import { packageStyles } from "@/constants/PACKAGES_STYLES";
import tooth from "@/assets/packages/tooth.svg";

export const packageFactory = (packageId) => {
  const key = Number(packageId);             
  const style = packageStyles[key];
  if (!style) {
    console.warn(`packageFactory: no style for id ${packageId}`);
  }
  return style || { image: tooth, bgColor: "#0077B6" };
};
