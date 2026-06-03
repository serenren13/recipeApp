import { Box, Typography } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import { useNavigate } from "react-router-dom";

const savedRecipes = [
  { id: 1, name: "Recipe Name", cookTime: "Cook Time" },
  { id: 2, name: "Recipe Name", cookTime: "Cook Time" },
  { id: 3, name: "Recipe Name", cookTime: "Cook Time" },
  { id: 4, name: "Recipe Name", cookTime: "Cook Time" },
  { id: 5, name: "Recipe Name", cookTime: "Cook Time" },
  { id: 6, name: "Recipe Name", cookTime: "Cook Time" },
];

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

  return (
    <Box
      component="button"
      type="button"
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      sx={{
        background: "none",
        border: 0,
        p: 0,
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        color: "inherit",
        font: "inherit",
        "&:hover .recipe-image": {
          borderColor: "primary.light",
          transform: "translateY(-2px)",
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
        {recipe.name} - {recipe.cookTime}
      </Typography>
    </Box>
  );
}

function MyRecipes() {
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
          mb: 4,
        }}
      >
        My Recipes
      </Typography>

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
          maxWidth: 980,
        }}
      >
        {savedRecipes.map((recipe) => (
          <MyRecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </Box>
    </Box>
  );
}

export default MyRecipes;
