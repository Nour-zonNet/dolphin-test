import { HomeSupportBtn } from "../../components";
import { Hero, LoginCard, Navbar } from "./components";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero + Login Section */}
      <main className="flex flex-col items-center justify-between px-4">
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
      <div className="absolute bottom-0 left-0 w-28 h-28 sm:w-40 sm:h-40 bg-[#FCE9D6] rounded-t-full"></div>

      {/* Floating Social Buttons */}
      <HomeSupportBtn />
    </div>
  );
};

export default HomePage;
