import MainLayout from "@/components/layout/MainLayout";
import { HomeSupportBtn } from "@/components/layout";

const AuthLayout = ({ children, handleBack, showBackButton = true }) => {
  return (
    <MainLayout handleBack={showBackButton ? handleBack : undefined}>
      <div className="relative px-4 sm:px-6 mt-37 md:mt-49 lg:mt-50">
        {children}
      </div>
      <HomeSupportBtn />
    </MainLayout>
  );
};

export default AuthLayout;
