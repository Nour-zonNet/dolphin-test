import { Navbar, MobileNav } from "./index";

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <MobileNav />
  </>
);

export default AppLayout;
