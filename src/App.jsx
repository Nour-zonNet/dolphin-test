import MobileNav from "./components/layouts/MobileNav";
import Navbar from "./components/layouts/Navbar";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Packages from "./pages/Packages";
import LessonsSchedule from "./pages/Schedule";
import HomePage from "./pages/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/schedule" element={<LessonsSchedule />} />
          <Route path="/subscriptions" element={<Packages />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
        {/* <MobileNav /> */}
      </BrowserRouter>
    </>
  );
}

export default App;
