import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth"; // Auth Wrapper
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import routesConfig from "./routes/routesConfig";

const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const noNavbarRoutes = ["/login", "/register", "/404"];

  return (
    <>
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/404" element={<NotFound />} />

        {/* Role-based routes (Protected) */}
        {Object.values(routesConfig)
          .flat()
          .map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<RequireAuth>{element}</RequireAuth>}
            />
          ))}

        {/* Catch-all route redirects to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
};

export default App;
