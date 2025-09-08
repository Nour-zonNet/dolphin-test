import React from 'react'

const ProfileHeader = ({ title }) => {
  return (
        <div className="w-full bg-white shadow-[0px_2px_4px_0px_rgba(192,192,192,0.25)] py-8 flex items-center relative">
            <div className="w-[90%] mx-auto flex items-center md:items-center justify-between">
                {/* Centered Content */}
                <div className="flex-1 text-center">
                <h1 className="font-bold text-navyteal text-sm md:text-2xl lg:text-3xl">{title}</h1>
            </div>
      </div>
    </div>
  )
}

export default ProfileHeader
