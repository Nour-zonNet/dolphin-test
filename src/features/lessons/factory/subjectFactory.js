// factory/packageFactory.js
import { subjectStyles } from "@/constants/SUBJECT_STYLES";

export const  subjectFactory = (subject) => {
  return subjectStyles[subject] || {
    image: null,
    bgColor: "#EEEEEE", 
  };
};