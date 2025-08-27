const Button = ({ icon, text, className, ...props }) => {
  return (
    <button
      {...props}
      className={
        className
          ? className
          : "flex items-center   mx-auto justify-center gap-2 text-xs bg-orangedeep text-darkblue font-medium px-18 sm:px-8 py-3 rounded-full hover:bg-btnClicked focus:bg-btnClicked cursor-pointer sm:text-sm   disabled:opacity-50 transition-all min-w-70"
      }
    >
      {icon && icon}
      <span className="text-lg">{text}</span>
    </button>
  );
};

export default Button;
