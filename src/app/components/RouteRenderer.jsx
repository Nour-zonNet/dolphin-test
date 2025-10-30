// components/RouteRenderer.jsx
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import { HomeSupportBtn } from "@/components/layout";
import withAuth from "@/features/auth/hoc/withAuth";

// Route renderer component
const RouteRenderer = ({ route }) => {
  const Component = route.element;

  if (!Component) {
    return <Outlet />;
  }

  // For protected routes, wrap with authentication HOC
  const ProtectedComponent = route.protected ? withAuth(Component) : Component;

  // Use layout flag to determine if AppLayout should be applied
  const shouldUseLayout = route.layout !== false; // Default to true unless explicitly set to false

  // Flags for optional UI elements
  const showNavbar = route.navbar !== false; // default true
  const showMobileNav = route.mobileNav !== false; // default true
  const showHomeSupportBtn = route.homeSupportBtn === true; // default false

  // Create the component element with proper error handling
  const renderComponent = () => {
    try {
      return React.createElement(ProtectedComponent);
    } catch (error) {
      console.error(`Error rendering component for route ${route.path}:`, error);
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          <h3>Component Loading Error</h3>
          <p>Failed to load {route.path}. Please refresh the page.</p>
          <details>
            <summary>Error Details</summary>
            {error.message}
          </details>
        </div>
      );
    }
  };

  // Wrap with Suspense for lazy loading
  const wrappedComponent = (
    <Suspense 
      fallback={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px' 
        }}>
          Loading...
        </div>
      }
    >
      {renderComponent()}
      {/* Render nested routes if they exist */}
      <Outlet />
    </Suspense>
  );

  return shouldUseLayout ? (
    <AppLayout
      showNavbar={showNavbar}
      showMobileNav={showMobileNav}
      showHomeSupportBtn={showHomeSupportBtn}
    >
      {wrappedComponent}
    </AppLayout>
  ) : (
    <>
      {wrappedComponent}
      {showHomeSupportBtn && <HomeSupportBtn />}
    </>
  );
};

export default RouteRenderer;