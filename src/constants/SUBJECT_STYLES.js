// constants/subjectStyles.js
import quranImg from "@/assets/packages/quran.svg";
import english from "@/assets/packages/arabic.svg";
import math from "@/assets/packages/math.svg";

import skratch from "@/assets/packages/skratch.svg";
export const subjectStyles = {
  البرمجة: {
    image: skratch,
    bgColor: "#D47C7C",
  },
  "لغة عربية": {
    image: english,
    bgColor: "#C51162", // amber
  },
  "لغة انجليزية": {
    image: english,
    bgColor: "#F59E0B", // amber
  },
  القرأن: {
    image: quranImg,
    bgColor: "#2E7D32", // green
  },
  "ركن مسلم": {
    image: quranImg,
    bgColor: "#2E7D32", // green
  },
  رياضيات: {
    image: math,
    bgColor: "#DFBE37", // blue
  },
  // fallback
  default: {
    image: null,
    bgColor: "#9CA3AF", // gray
  },
};
