import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";

import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

// Master Pages
import MaterialMaster from "./pages/master/MaterialMaster";
import ProjectMaster from "./pages/master/ProjectMaster";
import ContractorVendorMaster from "./pages/master/ContractorVendorMaster";
import ActivityMaster from "./pages/master/ActivityMaster";

// Transaction Pages
import GRNEntryForm from "./pages/transaction/GRNEntryForm";
import IssuePlates from "./pages/transaction/IssuePlates";
import Fabrication from "./pages/transaction/Fabrication";

const drawerWidth = 240;

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  const isLoggedIn = () => !!localStorage.getItem("token");
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

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

      {!isLoggedIn() ? (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <>
          <Topbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

          <Sidebar
            open={sidebarOpen}
            isMobile={isMobile}
            toggleSidebar={toggleSidebar}
          />

          <Box
            component="main"
            sx={{
              ml: sidebarOpen && !isMobile ? `${drawerWidth}px` : 0,
              pt: "80px",
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

              {/* MASTER ROUTES */}
              <Route path="/material-master" element={<MaterialMaster />} />
              <Route path="/project-master" element={<ProjectMaster />} />
              <Route path="/contractor-vendor-master" element={<ContractorVendorMaster />} />
              <Route path="/activity-master" element={<ActivityMaster />} />

              {/* TRANSACTION ROUTES */}
              <Route path="/grn-entry" element={<GRNEntryForm />} />
              <Route path="/issue-plates" element={<IssuePlates />} />
              <Route path="/fabrication" element={<Fabrication />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
        </>
      )}
    </BrowserRouter>
  );
}