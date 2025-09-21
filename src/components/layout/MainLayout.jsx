import {
  FooterIllustration,
  HeaderIllustration,
} from "../../features/auth/components";

const MainLayout = ({ children, handleBack }) => {
  return (
    <div className="flex flex-col items-stretch relative min-h-svh">
      <HeaderIllustration handleBack={handleBack} />

     {children}
      <FooterIllustration />
    </div>
  );
};

export default MainLayout;