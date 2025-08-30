import {
  FooterIllustration,
  HeaderIllustration,
} from "../../features/auth/components";
import HomeSupportBtn from "./HomeSupportBtn";

const MainLayout = ({ children, handleBack }) => {
  return (
    <div className="flex flex-col items-stretch relative min-h-screen">
      <HeaderIllustration handleBack={handleBack} />

     {children}
      <HomeSupportBtn />
      <FooterIllustration />
    </div>
  );
};

export default MainLayout;