import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <Box display="flex">
      <Sidebar open={open} toggleSidebar={toggleSidebar} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: {
            xs: 0,
            sm: 0,
            md: 3,
          },
          mt: "50px",
          transition: "margin-left 0.3s",
          marginLeft: open ? "240px" : isMobile ? "0" : "64px",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
