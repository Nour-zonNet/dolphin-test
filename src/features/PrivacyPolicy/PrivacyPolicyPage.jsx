import React from "react";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { Header } from "../../components/layout";

const PrivacyPolicyPage = () => {
  return (
    <div>
      <Header  onBack={"/"} title="سياسة الخصوصية" />
      <PrivacyPolicy />
    </div>
  );
};

export default PrivacyPolicyPage;
