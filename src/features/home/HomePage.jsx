import { Hero, LoginCard, Navbar, SocialButtons } from "./components";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero + Login Section */}
      <main className="flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-12 mt-8 gap-8 lg:gap-16">
        {/* Left: Hero */}
        <div className="flex-1 text-center lg:text-left">
          <Hero />
        </div>

        {/* Right: Login Card */}
        <div className="flex-1 w-full max-w-md">
          <LoginCard />
        </div>
      </main>

      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-28 h-28 sm:w-40 sm:h-40 bg-[#FCE9D6] rounded-t-full"></div>

      {/* Floating Social Buttons */}
      <SocialButtons />
    </div>
  );
};

export default HomePage;
