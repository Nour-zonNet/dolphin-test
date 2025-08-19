import React from "react";
import { useTranslation } from "react-i18next";
import "./i18n"; 
import Packages from "./pages/Packages";

function App() {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <Packages />
    </div>
  );
}

export default App;
