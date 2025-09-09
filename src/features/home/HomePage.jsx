import { Navigate } from "react-router-dom";
import { HomeSupportBtn } from "../../components";
import { RightKite } from "../../utils/Illustrations";
import { FooterIllustration } from "../auth/components";
import { useAuth } from "../auth/hooks/useAuth";
import { Hero, LoginCard, Navbar } from "./components";
// import { Overlay, Spinner } from "@/components/feedback";
import { Pin } from "../../utils/icons";

const HomePage = () => {
  const { isFullyAuthenticated } = useAuth();

  // If user is authenticated, redirect to schedule
  if (isFullyAuthenticated()) {
    return <Navigate to="/schedule" replace />;
  }

  return (
    <div className="min-h-screen relative flex flex-col bg-white overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero + Login Section */}
      <main className="flex-1 flex flex-col  items-center justify-around  px-4 sm:px-6 py-8  pb-40 max-w-7xl mx-auto w-full">
        {/* Hero Section (Left on Desktop / Top on Mobile) */}
        <Hero />

        {/* Login Card (Right on Desktop / Bottom on Mobile) */}
        <div className="w-full lg:w-1/2 flex justify-center mt-16 lg:mt-0">
          <LoginCard />
        </div>
      </main>

      {/* Floating Social Buttons */}
      <HomeSupportBtn />

      {/* Footer Illustration */}
      <FooterIllustration />
      <Pin className="absolute bottom-[50%] sm:bottom-[45%] left-10 w-20 sm:w-30 md:w-40 lg:w-40 h-20 sm:h-30 md:h-40 lg:h-40 z-0" />

      {/* Background Illustrations */}
      <RightKite className="absolute bottom-[40%] sm:bottom-[40%] right-0 w-40 sm:w-50 md:w-60 lg:w-70 z-0" />
    </div>
  );
};

export default HomePage;
