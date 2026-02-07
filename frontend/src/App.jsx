import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";

import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CuttingPlates from "./pages/CuttingPlates";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

const drawerWidth = 240;

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  const isLoggedIn = () => !!localStorage.getItem("token");
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Responsive layout handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BrowserRouter>
      <CssBaseline />

      {/* If the user is NOT logged in → only render login routes */}
      {!isLoggedIn() ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <>
          {/* TOPBAR */}
          <Topbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

          {/* SIDEBAR */}
          <Sidebar
            open={sidebarOpen}
            isMobile={isMobile}
            toggleSidebar={toggleSidebar}
          />

          {/* MAIN AREA */}
          <Box
            component="main"
            sx={{
              ml: sidebarOpen && !isMobile ? `${drawerWidth}px` : 0,
              pt: "80px", // topbar height
              px: 3,
              pb: 3,
              backgroundColor: "#f8f9fa",
              minHeight: "100vh",
              width: "100%",
              transition: "margin-left 0.3s ease",
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/cutting-plates" element={<CuttingPlates />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />

              {/* Unknown URL → dashboard */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
        </>
      )}
    </BrowserRouter>
  );
}
