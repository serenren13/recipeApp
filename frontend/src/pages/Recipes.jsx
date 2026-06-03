import { Box, Typography, TextField, Tab, Tabs, Grid, Pagination, CircularProgress, Alert, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { useRecipes } from "../hooks/useRecipes";
import RecipeCard from "../components/RecipeCard";

function Recipes() {
    const { recipes, loading, error, search, setSearch, tab, setTab, page, setPage, totalPages } = useRecipes();

    return (
        <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", px: 4, py: 4 }}>

            {/* Toggle */}
            <Tabs
                value={tab}
                onChange={(e, newVal) => setTab(newVal)}
                sx={{ mb: 3 }}
                slotProps={{ style: { backgroundColor: "#7AE2CF" } }}
            >
                <Tab label="Official Recipes" value="official" sx={{ color: "text.secondary", "&.Mui-selected": { color: "text.primary" } }} />
                <Tab label="User Recipes" value="user" sx={{ color: "text.secondary", "&.Mui-selected": { color: "text.primary" } }} />
            </Tabs>

            {/* Search */}
            <TextField
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                sx={{
                    mb: 4,
                    input: { color: "text.primary" },
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "primary.main" },
                        "&:hover fieldset": { borderColor: "primary.light" },
                    }
                }}
            />

            {/* Error */}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {/* Loading */}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt:6 }}>
                    <CircularProgress sx={{ color: "primary.main" }} />
                </Box>
            )}

            {/* Empty state */}
            {!loading && !error && recipes.length === 0 && (
                <Box sx={{ textAlign: "center", mt: 6 }}>
                    <Typography variant="h6" sx={{ color: "text.secondary" }}>
                        No recipes found. Try a different search!
                    </Typography>
                </Box>
            )}

           {!loading && !error && recipes.length > 0 && (
                <Grid container spacing={3}>
                    {recipes.map((recipe) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={recipe.id}>
                        <RecipeCard
                            id={recipe.id}
                            title={recipe.title}
                            imageUrl={recipe.imageUrl}
                            cookTimeMinutes={recipe.cookTimeMinutes}
                            difficulty={recipe.difficulty}
                            rating={recipe.rating}
                            cuisine={recipe.cuisine}
                            isUserRecipe={tab === "user"}
                        />

                    </Grid>
                    ))}
                </Grid>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, val) => setPage(val)}
                        sx={{
                            "& .MuiPaginationItem-root": { color: "text.secondary" },
                            "& .Mui-selected": { backgroundColor: "primary.main" },
                        }}
                    />
                </Box>
            )}

            {/* FAB - Create Recipe */}
            <Fab
                component={Link}
                to="/create-recipe"
                sx={{
                    position: "fixed",
                    bottom: 32,
                    right: 32,
                    backgroundColor: "primary.main",
                    color: "secondary.main",
                    "&:hover": { backgroundColor: "primary.light" },
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
}

export default Recipes;