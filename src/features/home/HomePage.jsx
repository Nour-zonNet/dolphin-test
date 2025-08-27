import { Navigate } from "react-router-dom";
import { HomeSupportBtn } from "../../components";
import { RightKite } from "../../utils/Illustrations";
import { FooterIllustration } from "../auth/components";
import { useAuth } from "../auth/hooks/useAuth";
import { Hero, LoginCard, Navbar } from "./components";

const HomePage = () => {
  const { token, user } = useAuth();
  if (token && user) {
    return <Navigate to="/schedule" replace />;
  }

  return (
    <div className="min-h-screen relative flex flex-col bg-white ">
      {/* Navbar */}
      <Navbar />
      {/* Hero + Login Section */}
      <main className="flex flex-col  justify-center items-center gap-10 px-6 py-10 lg:px-16 lg:py-20">
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
      {/* <Pencel className=" hidden md:block absolute bottom-[50%] left-10 sm:h-20 md:w-40 lg-w-120" />{" "} */}
      <RightKite className=" hidden sm:block absolute bottom-[50%] sm:w-40 md:w-60  " />
    </div>
  );
};

export default HomePage;
