import React from 'react'
import { FooterIllustration, HeaderIllustration } from '../../features/auth/components'
import { HomeSupportBtn } from '../ui'

const MainLayout = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen justify-between'>
        <HeaderIllustration />

        <main className="flex-grow mt-16">
            {children}
        </main>
        <HomeSupportBtn />
        <FooterIllustration />
      
    </div>
  )
}

export default MainLayout
