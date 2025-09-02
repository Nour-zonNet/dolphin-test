import React from 'react'

const ProfileButtons = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  onClick,
  ...props }) => {
    
  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-colors";
  
  const variants = {
    primary: "bg-foundationorangenormal text-text hover:bg-foundation-orangenormal-active",
    secondary: "border border-foundationorangenormal text-text hover:bg-foundation-orangelight-active",
    danger: "border border-foundationorangelight-hover text-foundationorangelight-hover hover:bg-red-50",
    outline: "border border-orangedeep text-text hover:bg-orange-50"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-base h-[50px]",
    md: "px-5 py-2.5 text-xl h-[70px]",
    lg: "px-6 py-6 text-xl"
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default ProfileButtons
