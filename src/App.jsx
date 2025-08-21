import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Navbar, MobileNav } from "./components/layout";

import HomePage from "./features/home";
import LessonsSchedule from "./features/lessons";
import Packages from "./features/packages";
import { Provider } from "react-redux";
import store from "./store";
import {RegisterForm} from "@/features/auth/components";

const App = () => {
  return (
    <>
    <Provider store={store}>

      <BrowserRouter>
        <>
          {" "}
          <Routes>
            <Route path="/" element={<RegisterForm />} />
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
              </Provider>
    </>
  );
};

export default App;
