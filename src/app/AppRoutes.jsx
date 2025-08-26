import { Routes, Route } from "react-router-dom";

// Layout
import { Navbar, MobileNav } from "@/components/layout";

// Pages
import HomePage from "@/features/home";
import LessonsSchedule from "@/features/lessons";
import Packages from "@/features/packages";
import { LoginPage } from "@/features/auth/pages";
import { useDispatch } from "react-redux";
import { useAuth } from "../features/auth/hooks/useAuth";

import { useEffect, useState } from "react";
import OTPInput from "../components/ui/InputOtp";
const AppRoutes = () => {
  const { loginUser } = useAuth();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [code, setCode] = useState("");
  // useEffect(() => {
  //   dispatch(loginUser({phoneNumber :"201156235709",pinCode:"111111"}))
  // }, [dispatch]);
  const [alpha, setAlpha] = useState("");
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div dir="ltr">
            <OTPInput length={6} value={code} onChange={setCode} />;
            <OTPInput
              length={6}
              value={otp}
              type="password"
              onChange={setOtp}
              allow={/^\d$/}
              inputProps={{ inputMode: "numeric", pattern: "\\d*" }}
            />
            <OTPInput
              length={6}
              value={alpha}
              onChange={setAlpha}
              allow={/^[A-Za-z0-9]$/}
              upperCase
            />
          </div>
        }
      />

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

      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRoutes;
