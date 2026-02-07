import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountCircle, ExitToApp } from "@mui/icons-material";

export default function Topbar({ toggleSidebar, sidebarOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);

  // Load username from localStorage (saved during login)
  const userName = localStorage.getItem("username") || "User";

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#ffffff",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Toolbar>
        {/* Menu Toggle Button */}
        <IconButton
          edge="start"
          color="primary"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{
            mr: 2,
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "rotate(90deg)",
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h5"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            color: "#1976d2",
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          Bala Bharthi
        </Typography>

        {/* User Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: "#333333",
              fontWeight: 500,
              display: { xs: "none", sm: "block" },
            }}
          >
            {userName}
          </Typography>

          <IconButton size="large" onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: "#1976d2",
                fontSize: "1.1rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 220,
                borderRadius: 2,
              },
            }}
          >
            <MenuItem
              onClick={handleMenuClose}
              sx={{
                py: 2,
                px: 3,
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                },
              }}
            >
              <AccountCircle sx={{ mr: 2, color: "#1976d2" }} />
              <Typography variant="body1">{userName}</Typography>
            </MenuItem>

            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 2,
                px: 3,
                color: "#d32f2f",
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.1)",
                },
              }}
            >
              <ExitToApp sx={{ mr: 2 }} />
              <Typography variant="body1">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
