import { Card, CardMedia, CardContent, Typography, Chip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function RecipeCard({ id, title, imageUrl, cookTimeMinutes, difficulty, rating, cuisine, isUserRecipe, authorName, status }) {
  const navigate = useNavigate();

  const STATUS_CHIP = {
    pending:   { label: "Pending review", bgcolor: "#FFF8DC", color: "#7a5800" },
    published: { label: "Published",      bgcolor: "#E0F7F4", color: "#077A7D" },
    rejected:  { label: "Rejected",       bgcolor: "#FDECEA", color: "#b00020" },
  };
  const chip = STATUS_CHIP[status];

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
      {!isUserRecipe && (
        <CardMedia component="img" height="180" image={imageUrl} alt={title} />
      )}
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600, fontSize: "1rem" }}>
          {title}
        </Typography>

        {isUserRecipe ? (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              By {authorName || "Unknown"}
            </Typography>
            {chip && (
              <Chip label={chip.label} size="small" sx={{ bgcolor: chip.bgcolor, color: chip.color, fontWeight: 600 }} />
            )}
          </Box>
        ) : (
          <>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip label={cuisine} size="small" sx={{ backgroundColor: "primary.main", color: "secondary.main" }} />
              <Chip label={difficulty} size="small" sx={{ backgroundColor: "primary.dark", color: "text.primary" }} />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: "auto" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>⏱ {cookTimeMinutes} mins</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>⭐ {rating}</Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default RecipeCard;