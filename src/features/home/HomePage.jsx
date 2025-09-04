import { Navigate } from "react-router-dom";
import { HomeSupportBtn } from "../../components";
import { RightKite } from "../../utils/Illustrations";
import { FooterIllustration } from "../auth/components";
import { useAuth } from "../auth/hooks/useAuth";
import { Hero, LoginCard, Navbar } from "./components";
import { Overlay, Spinner } from "@/components/feedback";

const HomePage = () => {
  const { isFullyAuthenticated } = useAuth();

  // If we have a token but no user yet, and we're still loading, show loading state

  // If user is authenticated, redirect to schedule
  if (isFullyAuthenticated()) {
    return <Navigate to="/schedule" replace />;
  }

  return (
    <div className="min-h-screen relative flex flex-col bg-white ">
      {/* Navbar */}
      <Navbar />
      {/* Hero + Login Section */}
      <main className="flex flex-col   items-center  px-4  lg:px-16 lg:py-20">
        {/* Hero (Left on Desktop / Top on Mobile) */}
        <div className="flex-1 flex justify-center">
          <Hero />
        </div>

        {/* Login Card (Right on Desktop / Bottom on Mobile) */}
        <div className="flex-1 flex justify-center w-full max-w-md">
          <LoginCard />
        </div>
      </main>
      {/* Floating Social Buttons */}
      <HomeSupportBtn />
      {/* Footer Illustration */}
      <FooterIllustration />
      {/* Background Illustrations */}
      {/* <Pencel className=" hidden md:block absolute bottom-[50%] left-10 sm:h-20 md:w-40 lg:w-120" />{" "} */}
      <RightKite className="  absolute bottom-[45%] right-0 w-50 sm:w-70 md:w-80 " />
    </div>
  );
};

export default HomePage;
