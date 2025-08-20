import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Navbar, MobileNav } from "./components/layout";

import HomePage from "./features/home";
import LessonsSchedule from "./features/schedule";
import Packages from "./features/packages";
import { useState } from "react";

const App = () => {
  const [isAuthenticated] = useState(false);
  return (
    <>
      <BrowserRouter>
        {isAuthenticated ? (
          <>
            {" "}
            <Navbar />
            <Routes>
              <Route path="/" element={<LessonsSchedule />} />
              <Route path="/schedule" element={<LessonsSchedule />} />
              <Route path="/subscriptions" element={<Packages />} />
            </Routes>
            <MobileNav />
          </>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
};

export default App;
