import React from 'react'
import { Link } from 'react-router-dom'
import { RightArrow } from "../../../utils/icons";
import { HomeKite } from "../../../utils/Illustrations";
const HeaderIllustration = () => {
  return (
    <div className="flex justify-between px-10">
        <Link to="/verify" className="outline-0 mt-12 border border-bordercolor w-[60px] h-[60px] rounded-full flex items-center justify-center">
            <RightArrow />
        </Link>
        <div className="">
            <HomeKite />
        </div>
    </div>
  )
}

export default HeaderIllustration
