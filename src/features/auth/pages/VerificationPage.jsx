// import { FooterIllustration, HeaderIllustration, VerificationInputs } from "../components"

import MainLayout from "@/components/layout/MainLayout"
import { VerificationInputs } from "../components"

const VerificationPage = () => {
  return (
    // <div className="flex flex-col min-h-screen justify-between">
    //   <HeaderIllustration />
    //   <div className="mt-16">
    //     <VerificationInputs />
    //   </div>
    //   <FooterIllustration />
    // </div>
    <MainLayout>
      <VerificationInputs />
    </MainLayout>
  )
}

export default VerificationPage
