import { Hero, LoginCard, Navbar, SocialButtons } from "./components";
const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-6 mt-8">
        <Hero />

        {/* Divider decoration */}
        {/* <div className="w-32 h-1 bg-orangedeep skew-3  rounded-full my-4"></div> */}
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#FCE9D6] rounded-t-full "></div>

        {/* Login Card */}
        <LoginCard />
      </main>

      {/* Background Decoration */}

      {/* Floating Social Buttons */}
      <SocialButtons />
    </div>
  );
};

export default HomePage;
