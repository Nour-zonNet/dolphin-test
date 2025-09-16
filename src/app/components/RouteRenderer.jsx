import { Suspense } from "react";
import { AppLayout } from "@/components/layout";
import { HomeSupportBtn } from "@/components/layout";
import withAuth from "@/features/auth/hoc/withAuth";
import { Overlay, Spinner } from "@/components/feedback";

// Simple loading fallback component
const RouteLoadingFallback = () => (
  <Overlay ariaLabel="Loading page">
    <Spinner size={48} colorClass="border-orange-500" />
  </Overlay>
);

// Route renderer component
const RouteRenderer = ({ route, children }) => {
  const Component = route.element;

  if (!Component) {
    return children;
  }

  // For protected routes, wrap with authentication HOC
  const ProtectedComponent = route.protected ? withAuth(Component) : Component;

  // Use layout flag to determine if AppLayout should be applied
  const shouldUseLayout = route.layout !== false; // Default to true unless explicitly set to false

  // Flags for optional UI elements
  const showNavbar = route.navbar !== false; // default true
  const showMobileNav = route.mobileNav !== false; // default true
  const showHomeSupportBtn = route.homeSupportBtn === true; // default false

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      {shouldUseLayout ? (
        <AppLayout
          showNavbar={showNavbar}
          showMobileNav={showMobileNav}
          showHomeSupportBtn={showHomeSupportBtn}
        >
          <ProtectedComponent />
        </AppLayout>
      ) : (
        <>
          <ProtectedComponent />
          {showHomeSupportBtn && <HomeSupportBtn />}
        </>
      )}
    </Suspense>
  );
};

export default RouteRenderer;
