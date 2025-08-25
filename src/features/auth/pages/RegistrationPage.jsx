import { RegisterForm, TopHero } from '../components'
import MainLayout from '../../../components/layout/MainLayout'

const RegistrationPage = () => {
  return (
    <MainLayout>
      <TopHero title="إكمال التسجيل"/>
      <RegisterForm />
    </MainLayout>
  )
}

export default RegistrationPage
