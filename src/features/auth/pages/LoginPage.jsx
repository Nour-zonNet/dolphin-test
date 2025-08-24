import { HomeSupportBtn } from "@/components/layout";
import MainLayout from "../../../components/layout/MainLayout";
import { LoginForm, TopHero } from "../components";

const LoginPage = () => {
  return (
    <div className="">
      <MainLayout className="">
        {/* Hero + Login Form */}

        <main className="">
          <div className="flex flex-col lg:flex-row items-center justify-between lg:mt-20 container">
            <TopHero />
            <LoginForm />
          </div>
        </main>
        <div>
          <HomeSupportBtn />
        </div>
      </MainLayout>
    </div>
  );
};

export default LoginPage;