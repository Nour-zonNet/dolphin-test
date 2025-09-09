// factory/packageFactory.js
import { subjectStyles } from "@/constants/SUBJECT_STYLES";
import tooth from "@/assets/packages/tooth.svg";

export const  subjectFactory = (subject) => {
  return subjectStyles[subject] || {
    image: tooth,
    bgColor: "#0077b6", 
  };
};