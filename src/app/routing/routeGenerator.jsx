// utils/routeGenerator.js
import React from "react";
import { Route } from "react-router-dom";
import RouteRenderer from "../components/RouteRenderer";

// Recursive function to generate routes from configuration
export const generateRoutes = (routes) => {
  return routes.map((route, index) => {
    // Create route element with error boundary
    const createRouteElement = (routeConfig) => {
      return <RouteRenderer route={routeConfig} />;
    };

    if (route.children && route.children.length > 0) {
      // Route with children (nested routes)
      // Whether parent has an element or not, render nested structure
      return (
        <Route 
          key={`${route.path}-${index}`} 
          path={route.path}
          element={createRouteElement(route)}
        >
          {/* Render child routes */}
          {route.children.map((child, childIndex) => (
            <Route
              key={`${route.path}-${child.path}-${childIndex}`}
              path={child.path}
              element={createRouteElement(child)}
            />
          ))}
        </Route>
      );
    } else {
      // Simple route
      return (
        <Route
          key={`${route.path}-${index}`}
          path={route.path}
          element={createRouteElement(route)}
        />
      );
    }
  });
};

// Alternative simplified version (if you prefer)
export const generateRoutesSimplified = (routes) => {
  const renderRoute = (routeConfig, key) => {
    const routeElement = <RouteRenderer route={routeConfig} />;

    if (routeConfig.children && routeConfig.children.length > 0) {
      return (
        <Route key={key} path={routeConfig.path} element={routeElement}>
          {routeConfig.children.map((child, childIndex) =>
            renderRoute(child, `${key}-child-${childIndex}`)
          )}
        </Route>
      );
    }

    return (
      <Route
        key={key}
        path={routeConfig.path}
        element={routeElement}
      />
    );
  };

  return routes.map((route, index) => renderRoute(route, `route-${index}`));
};

// Helper function to flatten routes for easier navigation
export const flattenRoutes = (routes, parentPath = "") => {
  const flattened = [];
  
  routes.forEach(route => {
    // Clean path to avoid double slashes
    const cleanParentPath = parentPath.endsWith('/') ? parentPath.slice(0, -1) : parentPath;
    const cleanRoutePath = route.path.startsWith('/') ? route.path.slice(1) : route.path;
    const fullPath = cleanParentPath ? `${cleanParentPath}/${cleanRoutePath}` : route.path;
    
    if (route.children) {
      flattened.push(...flattenRoutes(route.children, fullPath));
    } else {
      flattened.push({
        ...route,
        fullPath: fullPath.replace(/\/\//g, '/'), // Remove double slashes
      });
    }
  });
  
  return flattened;
};

// Helper function to check if route is public
export const isPublicRoute = (path, allRoutes) => {
  const flattenedRoutes = flattenRoutes(allRoutes);
  const route = flattenedRoutes.find(r => r.fullPath === path);
  return route ? route.public === true : false;
};

// Helper function to check if route requires layout
export const requiresLayout = (path, allRoutes) => {
  const flattenedRoutes = flattenRoutes(allRoutes);
  const route = flattenedRoutes.find(r => r.fullPath === path);
  return route ? route.layout !== false : true; // Default to true
};