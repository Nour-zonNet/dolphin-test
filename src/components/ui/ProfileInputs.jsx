import React from 'react'

const ProfileInputs = ({ 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  className = "",
  ...props }) => {
  return (
    <div className={`relative w-full h-[60px] rounded-[100px] border-[0.5px] border-solid border-[#aaaaaa] overflow-hidden ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full h-full px-10 text-lg text-[#5d6062] bg-transparent outline-none disabled:bg-gray-50"
        {...props}
      />
    </div>
  )
}

export default ProfileInputs
