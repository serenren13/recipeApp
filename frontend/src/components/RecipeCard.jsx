import { Card, CardMedia, CardContent, Typography, Chip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function RecipeCard({ id, title, imageUrl, cookTimeMinutes, difficulty, rating, cuisine, isUserRecipe }) {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/recipes/${id}`)}
      sx={{
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease",
        "&:hover": { transform: "scale(1.02)" },
      }}
    >
      {/* Only show image for official recipes */}
      {!isUserRecipe && (
        <CardMedia component="img" height="180" image={imageUrl} alt={title} />
      )}
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600, fontSize: "1rem" }}>
          {title}
        </Typography>
        {!isUserRecipe && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip label={cuisine} size="small" sx={{ backgroundColor: "primary.main", color: "secondary.main" }} />
            <Chip label={difficulty} size="small" sx={{ backgroundColor: "primary.dark", color: "text.primary" }} />
          </Box>
        )}
        {!isUserRecipe && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: "auto" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>⏱ {cookTimeMinutes} mins</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>⭐ {rating}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default RecipeCard