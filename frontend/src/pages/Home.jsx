import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { getOfficialRecipes } from "../api/recipeApi";

import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

function Home() {

  const { user } = useAuth();

  const [trending, setTrending] = useState([]);
  const [community, setCommunity] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingCommunity, setLoadingCommunity] = useState(true);

  // -------------------------
  // TRENDING
  // -------------------------
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getOfficialRecipes({ limit: 10 });
        setTrending(data.recipes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchTrending();
  }, []);

  // -------------------------
  // COMMUNITY
  // -------------------------
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const q = query(
          collection(db, "recipes"),
          orderBy("createdAt", "desc"),
          limit(10)
        );

        const snap = await getDocs(q);

        const data = snap.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            source: "user"
          }))
          .filter(r => r.status === "published")

        setCommunity(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCommunity(false);
      }
    };

    fetchCommunity();
  }, []);

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", px: 4, py: 6 }}>

      {/* HERO */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          {user ? `Welcome Back, ${user.displayName || "Chef"}!` : "Welcome to Food Connect"}
        </Typography>
      </Box>

      {/* TRENDING */}
      <Box sx={{ mb: 6 }}>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5">Trending Recipes</Typography>

          <Button component={Link} to="/recipes" size="small">
            See All →
          </Button>
        </Box>

        {loadingTrending ? (
          <CircularProgress />
        ) : (
          <Box sx={{
            display: "flex", gap: 2, overflowX: "auto", pb: 1,
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-track": { backgroundColor: "#06202B", borderRadius: 4 },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#077A7D", borderRadius: 4 },
            "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#7AE2CF" },
          }}>
            {trending.map(recipe => (
              <Box key={recipe.id} sx={{ minWidth: 220 }}>
                <RecipeCard {...recipe} isUserRecipe={false} />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* COMMUNITY */}
      <Box sx={{ mb: 6 }}>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5">Community Recipes</Typography>

          <Button component={Link} to="/recipes?tab=created" size="small">
            See All →
          </Button>
        </Box>

        {loadingCommunity ? (
          <CircularProgress />
        ) : community.length === 0 ? (
          <Typography sx={{ color: "text.secondary" }}>
            No community recipes yet.
          </Typography>
        ) : (
          <Box sx={{
            display: "flex", gap: 2, overflowX: "auto", pb: 1,
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-track": { backgroundColor: "#06202B", borderRadius: 4 },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#077A7D", borderRadius: 4 },
            "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#7AE2CF" },
          }}>
            {community.map(recipe => (
              <Box key={recipe.id} sx={{ minWidth: 220 }}>
                <RecipeCard
                  id={recipe.id}
                  title={recipe.title}
                  imageUrl={recipe.imageUrl}
                  cookTimeMinutes={recipe.cookTimeMinutes}
                  difficulty={recipe.difficulty}
                  cuisine={recipe.cuisine}
                  isUserRecipe={true}
                  authorName={recipe.authorName}
                  status={recipe.status}
                  averageRating={recipe.averageRating}
                  ratingCount={recipe.ratingCount}
                  commentCount={recipe.commentCount}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

    </Box>
  );
}

export default Home;