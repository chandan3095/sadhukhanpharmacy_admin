import { AppBar, Toolbar, Typography } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1400 }}>
      {" "}
      {/* Higher zIndex than sidebar */}
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Material Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
