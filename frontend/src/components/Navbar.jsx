import { AppBar, Toolbar, Box, Button, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";


function Navbar() {
    const { user } = useAuth();

    return (
        <AppBar position="static" color="primary">
            <Toolbar sx={{ justifyContent: "space-between" }}>

                {/* Logo / App Name */}
                <Box component={Link} to="/" sx={{ textDecoration: "none" }}>
                🍴 {/* placeholder till we decide on logo/name */}
                </Box>

                {/* Nav Links */}
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    {user ? (
                        // SIGNED IN
                        <>
                        <Button color="secondary" component={Link} to="/">Home</Button>
                        <Button color="secondary" component={Link} to="/recipes">Recipes</Button>
                        <Button color="secondary" component={Link} to="/my-recipes">My Recipes</Button>
                        <Button color="secondary" component={Link} to="/create-recipe">Create Recipe</Button>
                        <IconButton color="secondary">
                            <NotificationsIcon />
                        </IconButton>
                        <Button variant="contained" color="secondary" onClick={() => signOut(auth)}>Log Out</Button>
                        </>
                    ) : (
                        // NOT SIGNED IN
                        <>
                        <Button color="secondary" component={Link} to="/recipes">Recipes</Button>
                        <Button color="secondary" component={Link} to="/signin">Sign In</Button>
                        <Button variant="contained" color="secondary" component={Link} to="/register">Register</Button>
                        </>
                    )}
                </Box>

            </Toolbar>
        </AppBar>
    )
}

export default Navbar;