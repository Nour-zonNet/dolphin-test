// Import your images
import HealthIcon from "../assets/packages/health.svg";
import QuranIcon from "../assets/packages/quran.svg";
import ScheduleSlider from "../components/widget/ScheduleSlider";

export const cards = [
  {
    title: "باقة الصحة العامة",
    description: "",
    color: "border-r-16 border-r-health",
    image: HealthIcon,
    group: "المجموعة الأولي",
    teacher: "أ. حنان",
  },
  {
    title: "باقة ركن المسلم",
    description: "",
    color: "border-r-16 border-r-quran",
    image: QuranIcon,
    group: "المجموعة الأولي",
    teacher: "أ. حنان",
  },
];
const Packages = () => {
  return (
    <div className="flex flex-col gap-17">
      <ScheduleSlider />
    </div>
  );
};

export default Packages;
