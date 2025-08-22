import { FooterIllustration, HeaderIllustration, VerificationInputs } from "../components"

const VerificationPage = () => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <HeaderIllustration />
      <div className="mt-16">
        <VerificationInputs />
      </div>
      <FooterIllustration />
    </div>
  )
}

export default VerificationPage
