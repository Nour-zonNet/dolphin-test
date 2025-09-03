import React from 'react'

const ProfileCard = ({ children, className = "", ...props }) => {
  return (
    <div 
      className={`bg-[#eef3f866] rounded-[32px] border border-solid border-[#3c3c4399] overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default ProfileCard
