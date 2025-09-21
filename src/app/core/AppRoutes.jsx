import { Routes, Route, Navigate } from "react-router-dom";

// Custom Hooks
import { useAppInitialization } from "@/hooks/useAppInitialization";

// Route Configuration and Generator
import { routes } from "../routing/routeConfig";
import { generateRoutes } from "../routing/routeGenerator";

const AppRoutes = () => {
  // Initialize app data
  useAppInitialization();

  return (
    <Routes>
      {/* Generated Routes from Configuration */}
      {generateRoutes(routes)}
      
      {/* Catch-all Route - Redirect to Home */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
};

export default AppRoutes;
