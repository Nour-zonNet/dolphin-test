import React from "react";
import { useTranslation } from "react-i18next";
import "./i18n"; 
import Navbar from "./components/layouts/Navbar";
import Packages from "./pages/Packages";
import Schedule from "./pages/Schedule"
import MobileNav from "./components/layouts/MobileBar";

const App = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="w-[80%] m-auto">
      <Navbar />
      <Packages />
      <Schedule />
      <MobileNav />
    </div>
  );
};

export default App;
