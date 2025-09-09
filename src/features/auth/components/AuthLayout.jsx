import MainLayout from "@/components/layout/MainLayout";
import { HomeSupportBtn } from "@/components/layout";

const AuthLayout = ({ children, handleBack, showBackButton = true }) => {
  return (
    <MainLayout  handleBack={showBackButton ? handleBack : undefined}>
      <div className="relative px-5 sm:px-6 mt-25 md:mt-30 lg:mt-35">
        {children}
      </div>
      <HomeSupportBtn />
    </MainLayout>
  );
};

export default AuthLayout;
