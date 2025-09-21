import { Navbar, MobileNav, HomeSupportBtn } from "./index";

const AppLayout = ({
  children,
  showNavbar = true,
  showMobileNav = true,
  showHomeSupportBtn = false,
}) => (
  <>
    {showNavbar && <Navbar />}
    {children}
    {showMobileNav && <MobileNav />}
    {showHomeSupportBtn && <HomeSupportBtn />}
  </>
);

export default AppLayout;
