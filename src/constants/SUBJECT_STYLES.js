// constants/subjectStyles.js
import quranImg from "@/assets/packages/quran.svg";
import english from "@/assets/packages/english.svg";
import tooth from "@/assets/packages/tooth.svg";
export const subjectStyles = {
  "لغة عربية": {
    image: english,
    bgColor: "#F59E0B", // amber
  },
  "القرأن": {
    image: quranImg,
    bgColor: "#2E7D32", // green
  },
  "رياضيات": {
    image: tooth,
    bgColor: "#3B82F6", // blue
  },
  // fallback
  default: {
    image: null,
    bgColor: "#9CA3AF", // gray
  },
};
