/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Typography,
  Avatar,
  Box,
  Button,
} from "@mui/material";
import {
  Dashboard,
  Menu,
  Edit,
  Logout,
  Medication,
  LocalPharmacy,
  LocalOffer,
  NotificationImportant,
  FeaturedPlayList,
  ListAlt,
  ReceiptLong,
  FactCheck,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

const listItems = [
  { id: 1, title: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
  { id: 2, title: "Add Doctor", path: "/add-doctor", icon: <Medication /> },
  {
    id: 3,
    title: "Add Product",
    path: "/add-product",
    icon: <LocalPharmacy />,
  },
  { id: 4, title: "Add Offer", path: "/add-offer", icon: <LocalOffer /> },
  {
    id: 5,
    title: "Add Notice",
    path: "/add-notice",
    icon: <NotificationImportant />,
  },
  {
    id: 6,
    title: "Doctor’s List",
    path: "/doctor-list",
    icon: <FeaturedPlayList />,
  },
  { id: 7, title: "Product’s List", path: "/product-list", icon: <ListAlt /> },
  { id: 8, title: "Offer’s List", path: "/offer-list", icon: <ReceiptLong /> },
  { id: 9, title: "Notice List", path: "/notice-list", icon: <FactCheck /> },
];

const Sidebar: React.FC<SidebarProps> = ({ open, toggleSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const getListStyles = (path: string) => ({
    backgroundColor: currentPath === path ? "#fff" : "transparent",
    "&:hover": {
      backgroundColor: "#41DC8E",
    },
    "& .MuiListItemIcon-root": {
      minWidth: "40px",
      color: currentPath === path ? "#7C7C7C" : "#fff",
    },
    "& .MuiListItemText-primary": {
      color: currentPath === path ? "#7C7C7C" : "#fff",
    },
    paddingY: "5px",
    paddingX: "16px",
    marginLeft: "16px",
    borderTopLeftRadius: "15px",
    borderBottomLeftRadius: "15px",
  });

  const handleLogout = () => {
    try {
      dispatch(logout());
      localStorage.setItem("isLoggedIn", "false");
      navigate("/");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Hamburger Icon for Mobile */}
      {isMobile && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1500,
            color: open ? "#fff" : theme.palette.primary.main,
            backgroundColor: open ? theme.palette.primary.main : "#fff",
            borderRadius: "50%",
            width: 40,
            height: 40,
            boxShadow: open ? 0 : 2,
            "&:hover": {
              backgroundColor: theme.palette.primary.light,
            },
          }}
        >
          <Menu />
        </IconButton>
      )}

      {/* Logout Button (Top-Right Corner) */}
      <Button
        onClick={handleLogout}
        variant="contained"
        sx={(theme) => ({
          position: "fixed",
          top: 16,
          right: 46,
          [theme.breakpoints.down("md")]: {
            right: 16,
          },
          backgroundColor: "#fff",
          color: "red",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "50px",
          padding: "8px 16px",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textTransform: "none",
          zIndex: 1400,
        })}
      >
        <Logout sx={{ color: "red" }} />
        <Typography
          sx={{
            color: "red",
            fontSize: "1rem",
            fontWeight: "500",
          }}
        >
          Hi, Debjyoti
        </Typography>
      </Button>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={toggleSidebar}
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 240 : isMobile ? 0 : 64,
            boxSizing: "border-box",
            transition: "width 0.3s",
            overflowX: "hidden",
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            border: "none",
          },
        }}
      >
        {/* User Section */}
        {open && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 5,
              paddingBottom: 2,
              borderBottom: "3px solid #fff",
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mb: 1,
                backgroundColor: "#fff",
                color: theme.palette.primary.main,
              }}
            >
              D
            </Avatar>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6">Admin Dashboard</Typography>
              <IconButton size="small" sx={{ color: "#fff" }}>
                <Edit fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2">Phone : 7866065406</Typography>
          </Box>
        )}

        {/* List Section */}
        <List>
          {listItems.map((item) => (
            <ListItem disablePadding sx={{ mb: 1 }} key={item.id}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => isMobile && toggleSidebar()}
                sx={getListStyles(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {open && <ListItemText primary={item.title} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
