import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },

  // ⭐ NEW ITEM ADDED HERE
  { text: "Cutting Plates", icon: <AssessmentIcon />, path: "/cutting-plates" },

  { text: "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
  { text: "Reports", icon: <AssessmentIcon />, path: "/reports" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];


export default function Sidebar({ open, isMobile, toggleSidebar }) {
  const location = useLocation();

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={open}
      onClose={toggleSidebar}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#f8f9fa",
          borderRight: "1px solid #e0e0e0",
          transition: "width 0.3s ease, transform 0.3s ease",
          transform: open ? "translateX(0)" : "translateX(-100%)",
        },
      }}
    >
      {/* Spacer for TopBar */}
      <Box sx={{ height: 64 }} />

      <List sx={{ pt: 2, px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem
              button
              component={Link}
              to={item.path}
              key={item.text}
              sx={{
                py: 1.5,
                px: 2,
                my: 0.5,
                borderRadius: 2,
                color: isActive ? "#1976d2" : "#5f6368",
                backgroundColor: isActive ? "#e3f2fd" : "transparent",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: isActive ? "#e3f2fd" : "#f1f3f4",
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "#1976d2" : "#5f6368",
                  minWidth: 40,
                  transition: "color 0.2s ease",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: isActive ? 600 : 500,
                }}
              />
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Footer */}
      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          borderTop: "1px solid #e0e0e0",
          color: "#9e9e9e",
          fontSize: "0.75rem",
        }}
      >
        © 2026 Bala Bharthi
      </Box>
    </Drawer>
  );
}