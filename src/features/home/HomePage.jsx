import { HomeSupportBtn } from "../../components";
import { FooterIllustration } from "../auth/components";
import { Hero, LoginCard, Navbar } from "./components";
import numbers from "@/assets/home/number.svg";

const HomePage = () => {
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero + Login Section */}
      <main className="flex flex-col">
        {/* Left: Hero */}
        <div className="text-center lg:text-left">
          <Hero />
        </div>

        {/* Right: Login Card */}
        <div className="w-full max-w-md">
          <LoginCard />
        </div>
      </main>

      {/* Background Decoration */}
      <div className="">
        {/* Floating Social Buttons */}
          <HomeSupportBtn />
          {/* <img src={numbers} alt="numbers" width="200px"/> */}
          <FooterIllustration />
      </div>
    </div>
  );
};

export default HomePage;
