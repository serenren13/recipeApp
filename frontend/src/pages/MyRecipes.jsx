import { useEffect, useMemo, useState } from "react";
import { Alert, Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function timestampMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (value.seconds) return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  return 0;
}

function formatStatus(status) {
  if (!status) return "Created Recipe";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getRecipeIdFromSavedDoc(id, data) {
  if (data.recipeId) return data.recipeId;
  if (data.externalId) return data.externalId;

  const [, ...rest] = String(id).split("_");
  return rest.length > 0 ? rest.join("_") : id;
}

function mapSavedRecipe(docSnapshot) {
  const data = docSnapshot.data();
  const recipeId = getRecipeIdFromSavedDoc(docSnapshot.id, data);
  const source = data.source || "official";

  return {
    id: docSnapshot.id,
    title: data.title || data.name || "Untitled Recipe",
    imageUrl: data.imageUrl || data.image || "",
    meta:
      data.cookTimeMinutes !== undefined
        ? `${data.cookTimeMinutes} min`
        : data.cookTime || "Saved Recipe",
    sortTime: timestampMillis(data.savedAt || data.createdAt),
    detailPath: source === "official" ? `/recipes/${recipeId}` : null,
  };
}

function mapCreatedRecipe(docSnapshot) {
  const data = docSnapshot.data();

  return {
    id: docSnapshot.id,
    title: data.title || data.name || "Untitled Recipe",
    imageUrl: data.imageUrl || data.image || "",
    meta:
      data.cookTimeMinutes !== undefined
        ? `${data.cookTimeMinutes} min`
        : formatStatus(data.status),
    sortTime: timestampMillis(data.createdAt),
    detailPath: null,
  };
}

function RecipePlaceholder() {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(122, 226, 207, 0.12)",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "primary.main",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Box
        sx={{
          width: "58%",
          aspectRatio: "1 / 1",
          position: "relative",
          color: "rgba(253, 235, 158, 0.5)",
        }}
      >
        <RestaurantIcon
          sx={{
            position: "absolute",
            top: "2%",
            left: "35%",
            fontSize: "38%",
            transform: "rotate(-8deg)",
          }}
        />
        <LocalDiningIcon
          sx={{
            position: "absolute",
            bottom: "15%",
            left: "4%",
            fontSize: "36%",
          }}
        />
        <LunchDiningIcon
          sx={{
            position: "absolute",
            bottom: "15%",
            right: "3%",
            fontSize: "37%",
            transform: "rotate(4deg)",
          }}
        />
      </Box>
    </Box>
  );
}

function MyRecipeCard({ recipe }) {
  const navigate = useNavigate();
  const isClickable = Boolean(recipe.detailPath);

  return (
    <Box
      component={isClickable ? "button" : "article"}
      type={isClickable ? "button" : undefined}
      onClick={isClickable ? () => navigate(recipe.detailPath) : undefined}
      sx={{
        background: "none",
        border: 0,
        p: 0,
        width: "100%",
        textAlign: "left",
        cursor: isClickable ? "pointer" : "default",
        color: "inherit",
        font: "inherit",
        "&:hover .recipe-image": {
          borderColor: isClickable ? "primary.light" : "primary.main",
          transform: isClickable ? "translateY(-2px)" : "none",
        },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.light",
          outlineOffset: "6px",
          borderRadius: "8px",
        },
      }}
    >
      <Box
        className="recipe-image"
        sx={{
          aspectRatio: "1 / 0.72",
          transition: "transform 0.2s ease, border-color 0.2s ease",
        }}
      >
        <RecipePlaceholder />
      </Box>
      <Typography
        sx={{
          mt: 1,
          px: 0.5,
          color: "text.primary",
          fontSize: "0.92rem",
          fontWeight: 700,
          lineHeight: 1.15,
          overflowWrap: "anywhere",
        }}
      >
        {recipe.title} - {recipe.meta}
      </Typography>
    </Box>
  );
}

function MyRecipes() {
  const { user } = useAuth();
  const [recipeView, setRecipeView] = useState("saved");
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [loading, setLoading] = useState({ saved: true, created: true });
  const [error, setError] = useState({ saved: "", created: "" });

  useEffect(() => {
    if (!user?.uid) {
      setSavedRecipes([]);
      setCreatedRecipes([]);
      setLoading({ saved: false, created: false });
      setError({ saved: "", created: "" });
      return undefined;
    }

    setLoading({ saved: true, created: true });
    setError({ saved: "", created: "" });

    const unsubscribeSaved = onSnapshot(
      collection(db, "users", user.uid, "savedRecipes"),
      (snapshot) => {
        const recipes = snapshot.docs
          .map(mapSavedRecipe)
          .sort((a, b) => b.sortTime - a.sortTime);

        setSavedRecipes(recipes);
        setLoading((current) => ({ ...current, saved: false }));
      },
      (err) => {
        console.error(err);
        setError((current) => ({
          ...current,
          saved: "Failed to load saved recipes.",
        }));
        setLoading((current) => ({ ...current, saved: false }));
      }
    );

    const createdQuery = query(
      collection(db, "recipes"),
      where("authorId", "==", user.uid)
    );
    const unsubscribeCreated = onSnapshot(
      createdQuery,
      (snapshot) => {
        const recipes = snapshot.docs
          .map(mapCreatedRecipe)
          .sort((a, b) => b.sortTime - a.sortTime);

        setCreatedRecipes(recipes);
        setLoading((current) => ({ ...current, created: false }));
      },
      (err) => {
        console.error(err);
        setError((current) => ({
          ...current,
          created: "Failed to load created recipes.",
        }));
        setLoading((current) => ({ ...current, created: false }));
      }
    );

    return () => {
      unsubscribeSaved();
      unsubscribeCreated();
    };
  }, [user?.uid]);

  const visibleRecipes = recipeView === "saved" ? savedRecipes : createdRecipes;
  const visibleLoading = loading[recipeView];
  const visibleError = error[recipeView];
  const emptyMessage = useMemo(
    () =>
      recipeView === "saved"
        ? "You have not saved any recipes yet."
        : "You have not created any recipes yet.",
    [recipeView]
  );

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "text.primary",
          fontWeight: 800,
          fontSize: "1rem",
          mb: 2,
        }}
      >
        My Recipes
      </Typography>

      <Tabs
        value={recipeView}
        onChange={(event, value) => setRecipeView(value)}
        sx={{
          mb: 4,
          minHeight: 36,
          "& .MuiTabs-indicator": {
            backgroundColor: "primary.light",
          },
        }}
      >
        <Tab
          label="Saved Recipes"
          value="saved"
          sx={{
            color: "text.secondary",
            minHeight: 36,
            px: 0,
            mr: 3,
            textTransform: "none",
            fontWeight: 700,
            "&.Mui-selected": { color: "text.primary" },
          }}
        />
        <Tab
          label="Created Recipes"
          value="created"
          sx={{
            color: "text.secondary",
            minHeight: 36,
            px: 0,
            textTransform: "none",
            fontWeight: 700,
            "&.Mui-selected": { color: "text.primary" },
          }}
        />
      </Tabs>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
          },
          columnGap: { xs: 3, sm: 5, md: 8 },
          rowGap: { xs: 3, md: 2.5 },
          width: "100%",
        }}
      >
        {visibleLoading && (
          <Box sx={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "primary.main" }} />
          </Box>
        )}

        {!visibleLoading && visibleError && (
          <Alert severity="error" sx={{ gridColumn: "1 / -1" }}>
            {visibleError}
          </Alert>
        )}

        {!visibleLoading && !visibleError && visibleRecipes.length === 0 && (
          <Typography sx={{ gridColumn: "1 / -1", color: "text.secondary" }}>
            {emptyMessage}
          </Typography>
        )}

        {!visibleLoading &&
          !visibleError &&
          visibleRecipes.map((recipe) => (
            <MyRecipeCard key={recipe.id} recipe={recipe} />
          ))}
      </Box>
    </Box>
  );
}

export default MyRecipes;
