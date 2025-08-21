const SliderNavButton = ({ ariaLabel, className, children }) => (
  <button
    className={`text-black w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 ${className}`}
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

export default SliderNavButton;
