import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Navbar, MobileNav } from "./components/layout";

import HomePage from "./features/home";
import LessonsSchedule from "./features/schedule";
import Packages from "./features/packages";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <>
          {" "}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/schedule"
              element={
                <>
                  <Navbar />
                  <LessonsSchedule />
                  <MobileNav />
                </>
              }
            />
            <Route
              path="/subscriptions"
              element={
                <>
                  <Navbar />
                  <Packages />
                  <MobileNav />
                </>
              }
            />
          </Routes>
        </>
      </BrowserRouter>
    </>
  );
};

export default App;
