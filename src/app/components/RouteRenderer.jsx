import { Suspense } from "react";
import { AppLayout } from "@/components/layout";

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

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      {route.protected ? (
        <AppLayout>
          <Component />
        </AppLayout>
      ) : (
        <Component />
      )}
    </Suspense>
  );
};

export default RouteRenderer;
