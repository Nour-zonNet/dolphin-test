import { Suspense } from "react";
import { AppLayout } from "@/components/layout";
import withAuth from "@/features/auth/hoc/withAuth";

// Simple loading fallback component
const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Route renderer component
const RouteRenderer = ({ route, children }) => {
  const Component = route.element;
  
  if (!Component) {
    return children;
  }

  // For protected routes, wrap with authentication HOC
  const ProtectedComponent = route.protected ? withAuth(Component) : Component;

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      {route.protected ? (
        <AppLayout>
          <ProtectedComponent />
        </AppLayout>
      ) : (
        <ProtectedComponent />
      )}
    </Suspense>
  );
};

export default RouteRenderer;
