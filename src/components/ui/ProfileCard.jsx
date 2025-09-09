import React from 'react'

const ProfileCard = ({ children, className = "", ...props }) => {
  return (
    <div 
      className={`bg-[#eef3f866] rounded-[32px] border-[0.5px] border-solid border-[#3c3c4322] overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default ProfileCard
