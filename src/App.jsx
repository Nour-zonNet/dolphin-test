import React from "react";
import { CustomArrowIcon } from "./assets/icons";
import { useTranslation } from "react-i18next";
import "./i18n"; 

function App() {
  const { t, i18n } = useTranslation();
  return (
    <div className="flex gap-4">
      <h1>{ t("welcome") }</h1>
      <CustomArrowIcon />
      <CustomArrowIcon size={40} color="blue" />
      <CustomArrowIcon size={40} color="#00C853" />
    </div>
  );
}

export default App;
