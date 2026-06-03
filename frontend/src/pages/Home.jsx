import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";

function Home() {

   const { user } = useAuth();
   const [trending, setTrending] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/recipes/official?limit=10");
        const data = await res.json();
        setTrending(data.recipes);
      } catch (err) {
        console.error("Failed to fetch trending recipes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
   }, []);

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", px: 4, py: 6 }}>
      
      {/* Hero Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ color: "text.primary", fontWeight: 700, mb: 1 }}>
          {user ? `Welcome Back, ${user.displayName || "Chef"}!` : "Welcome to Food Connect"}
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
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "primary.main" }} />
          </Box>
        ) : (
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
          {trending.map((recipe) => (
            <Box key={recipe.id} sx={{ minWidth: 220, flexShrink: 0 }}>
              <RecipeCard
                id={recipe.id}
                title={recipe.title}
                imageUrl={recipe.imageUrl}
                cookTimeMinutes={recipe.cookTimeMinutes}
                difficulty={recipe.difficulty}
                rating={recipe.rating}
                cuisine={recipe.cuisine}
              />
            </Box>
          ))}
        </Box>
        )}
      </Box>

      {/* Community Recipes - placeholder until Firestore is set up */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ color: "text.primary", fontWeight: 600 }}>
            Community Recipes
          </Typography>
          <Button component={Link} to="/recipes" color="secondary" size="small">
            See All →
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Community recipes coming soon!
          </Typography>
        </Box>
      </Box>

    </Box>
  );
}

export default Home;
