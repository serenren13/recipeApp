import { AppBar, Toolbar, Box, Button, IconButton, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar() {
  const { user, isAdmin } = useAuth();

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Box component={Link} to="/" sx={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "#7AE2CF",
              "& span": { color: "#FDEB9E" },
            }}
          >
            Food <span>Connect</span>
          </Typography>
        </Box>

        {/* Nav Links */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {user ? (
            <>
              <Button color="secondary" component={Link} to="/">Home</Button>
              <Button color="secondary" component={Link} to="/recipes">Recipes</Button>
              <Button color="secondary" component={Link} to="/my-recipes">My Recipes</Button>
              <Button color="secondary" component={Link} to="/create-recipe">Create Recipe</Button>
              {/* Only show Admin link to admins */}
              {isAdmin && (
                <Button color="secondary" component={Link} to="/admin">Admin</Button>
              )}
              <IconButton color="secondary">
                <NotificationsIcon />
              </IconButton>
              <Button variant="contained" color="secondary" onClick={() => signOut(auth)}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button color="secondary" component={Link} to="/recipes">Recipes</Button>
              <Button color="secondary" component={Link} to="/signin">Sign In</Button>
              <Button variant="contained" color="secondary" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
