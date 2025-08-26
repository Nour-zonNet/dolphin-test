import React from "react";
import {
  FooterIllustration,
  HeaderIllustration,
} from "../../features/auth/components";
import HomeSupportBtn from "./HomeSupportBtn";

const MainLayout = ({ children, handleBack }) => {
  return (
    <div className="flex flex-col relative min-h-screen justify-between">
      <HeaderIllustration handleBack={handleBack} />

      <main className="flex-grow ">{children}</main>
      <HomeSupportBtn />
      <FooterIllustration />
    </div>
  );
};

export default MainLayout;
