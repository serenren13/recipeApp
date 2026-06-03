import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {

   const { user } = useAuth();

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", px: 4, py: 6 }}>
      
      {/* Hero Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ color: "text.primary", fontWeight: 700, mb: 1 }}>
          {user ? `Welcome Back, ${user.displayName || "Chef"}!` : "Welcome to RecipeApp"}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
          {user
            ? "Pick up where you left off."
            : "Discover recipes, save your favorites, and share your own."}
        </Typography>
        {!user && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button component={Link} to="/register" color="primary">
              Get Started
            </Button>
            <Button component={Link} to="/signin" variant="outlined" sx={{ color: "text.secondary", borderColor: "text.secondary" }}>
              Sign In
            </Button>
          </Box>
        )}
      </Box>

      {/* Trending Recipes Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ color: "text.primary", fontWeight: 600 }}>
            Trending Recipes
          </Typography>
          <Button component={Link} to="/recipes" color="secondary" size="small">
            See All →
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box
              key={i}
              sx={{
                minWidth: 200,
                height: 240,
                backgroundColor: "primary.main",
                borderRadius: "12px",
                border: "1px solid",
                borderColor: "primary.light",
                flexShrink: 0,
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Community Recipes Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ color: "text.primary", fontWeight: 600 }}>
            Community Recipes
          </Typography>
          <Button component={Link} to="/recipes" color="secondary" size="small">
            See All →
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box
              key={i}
              sx={{
                minWidth: 200,
                height: 240,
                backgroundColor: "primary.main",
                borderRadius: "12px",
                border: "1px solid",
                borderColor: "primary.light",
                flexShrink: 0,
              }}
            />
          ))}
        </Box>
      </Box>

    </Box>
  );
}

export default Home;
