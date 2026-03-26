import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useState } from "react";

const drawerWidth = 240;

export default function Sidebar({ open, isMobile, toggleSidebar }) {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState("master");

  const isActive = (path) => location.pathname === path;

  const handleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={open}
      onClose={toggleSidebar}
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e0e0e0",
          fontSize: "0.875rem",
        },
      }}
    >
      <Box sx={{ height: 64 }} />

      <List sx={{ px: 1 }}>

        {/* DASHBOARD */}
        <ListItemButton
          component={Link}
          to="/"
          selected={isActive("/")}
          sx={{
            borderRadius: 1,
            mb: 1,
            "&.Mui-selected": {
              backgroundColor: "#e3f2fd",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 34 }}>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* MASTER MAIN */}
        <ListItemButton
          onClick={() => handleDropdown("master")}
          sx={{
            borderRadius: 1,
            mb: 0.5,
            backgroundColor: "#f4f6f8",
            "&:hover": { backgroundColor: "#e9ecef" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 34 }}>
            <InventoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Master" />
          <ExpandMoreIcon
            sx={{
              transition: "0.3s",
              transform:
                activeDropdown === "master"
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
            }}
            fontSize="small"
          />
        </ListItemButton>

        <Collapse in={activeDropdown === "master"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>

            {[
              { label: "Item Master", path: "/material-master" },
              { label: "Project Master", path: "/project-master" },
              { label: "Contractor / Vendor Master", path: "/contractor-vendor-master" },
              { label: "Activity Master", path: "/activity-master" },
            ].map((item) => (
              <ListItemButton
                key={item.path}
                sx={{
                  pl: 4,
                  borderRadius: 1,
                  mb: 0.5,
                  "&.Mui-selected": {
                    backgroundColor: "#e3f2fd",
                  },
                }}
                component={Link}
                to={item.path}
                selected={isActive(item.path)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}

          </List>
        </Collapse>

        {/* TRANSACTION MAIN */}
        <ListItemButton
          onClick={() => handleDropdown("transaction")}
          sx={{
            borderRadius: 1,
            mt: 1,
            mb: 0.5,
            backgroundColor: "#f4f6f8",
            "&:hover": { backgroundColor: "#e9ecef" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 34 }}>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Transaction" />
          <ExpandMoreIcon
            sx={{
              transition: "0.3s",
              transform:
                activeDropdown === "transaction"
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
            }}
            fontSize="small"
          />
        </ListItemButton>

        <Collapse in={activeDropdown === "transaction"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>

            {[
              { label: "GRN Entry Form", path: "/grn-entry" },
              { label: "Issue Plates", path: "/issue-plates" },
              { label: "Fabrication", path: "/fabrication" },
            ].map((item) => (
              <ListItemButton
                key={item.path}
                sx={{
                  pl: 4,
                  borderRadius: 1,
                  mb: 0.5,
                  "&.Mui-selected": {
                    backgroundColor: "#e3f2fd",
                  },
                }}
                component={Link}
                to={item.path}
                selected={isActive(item.path)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}

          </List>
        </Collapse>

      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box
        sx={{
          p: 2,
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#999",
        }}
      >
        © 2026 Bala Bharthi
      </Box>
    </Drawer>
  );
}