import { HomeSupportBtn } from '../../../components/ui'
import { FooterIllustration, HeaderIllustration, LoginForm, TopHero } from '../components'

const LoginPage = () => {
  return (
      <div className="">
        {/* Hero + Login Form */}
        <main className="">
          <HeaderIllustration />
          <div className="flex flex-col lg:flex-row items-center justify-between lg:mt-20 container">
            <TopHero />
            <LoginForm />
          </div>
        </main>
        <div>
          <HomeSupportBtn />
          <FooterIllustration />
        </div>
    </div>
  )
}

export default LoginPage
