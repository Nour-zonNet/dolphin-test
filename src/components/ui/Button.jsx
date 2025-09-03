import { cn } from "@/utils/index";
const Button = ({ icon, text, className, ...props }) => {
  return (
    <button
      {...props}
      className={cn(
        "flex items-center w-53 sm:w-53 md:w-79 lg:w-91 py-2  mx-auto justify-center gap-2  bg-orangedeep text-darkblue font-medium    rounded-full hover:bg-btnClicked focus:bg-btnClicked cursor-pointer sm:text-sm   disabled:opacity-50 transition-all ",
        className
      )}
    >
      {icon && icon}
      <span className="text-base md:text-lg">{text}</span>
    </button>
  );
};

export default Button;
