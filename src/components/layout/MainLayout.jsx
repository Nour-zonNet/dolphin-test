<<<<<<< HEAD
import React from 'react'
import { FooterIllustration, HeaderIllustration } from '../../features/auth/components'
import HomeSupportBtn from './HomeSupportBtn'

const MainLayout = ({ children }) => {
  return (
    <div className='flex flex-col relative min-h-screen justify-between'>
        <HeaderIllustration />

        <main className="flex-grow ">
            {children}
        </main>
        <HomeSupportBtn />
        <FooterIllustration />
      
    </div>
  )
}

export default MainLayout
=======
import React from "react";
import {
  FooterIllustration,
  HeaderIllustration,
} from "../../features/auth/components";
import HomeSupportBtn from "./HomeSupportBtn";

const MainLayout = ({ children, handleBack }) => {
  return (
    <div className="flex flex-col relative min-h-screen justify-between">
      <HeaderIllustration handleBack={handleBack} />

      <main className="flex-grow ">{children}</main>
      <HomeSupportBtn />
      <FooterIllustration />
    </div>
  );
};

export default MainLayout;
>>>>>>> e69b5935486d816f17f85bf3f864b6f7d2965a0d
