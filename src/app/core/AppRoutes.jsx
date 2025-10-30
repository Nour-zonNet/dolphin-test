import { Routes, Route } from "react-router-dom";

// Custom Hooks
import { useAppInitialization } from "@/hooks/useAppInitialization";

// Route Configuration and Generator
import { routes } from "../routing/routeConfig";
import { generateRoutes } from "../routing/routeGenerator";

// Error Pages
import NotFound404 from "@/components/NotFound404";

const AppRoutes = () => {
  // Initialize app data
  useAppInitialization();

  return (
    <Routes>
      {/* Generated Routes from Configuration */}
      {generateRoutes(routes)}
      
      {/* Catch-all Route - Show 404 Page */}
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
};

export default AppRoutes;
