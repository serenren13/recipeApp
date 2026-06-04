import {
    Box,
    Typography,
    TextField,
    Tab,
    Tabs,
    Grid,
    Pagination,
    CircularProgress,
    Alert,
    Fab
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { useMyRecipes } from "../hooks/useMyRecipes";

function MyRecipes() {
    const {
        recipes,
        loading,
        error,
        search,
        setSearch,
        tab,
        setTab,
        page,
        setPage,
        totalPages
    } = useMyRecipes();

    return (
        <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", px: 4, py: 4 }}>

            {/* Tabs */}
            <Tabs
                value={tab}
                onChange={(e, v) => setTab(v)}
                sx={{ mb: 3 }}
            >
                <Tab
                    label="Saved Recipes"
                    value="saved"
                    sx={{ color: "text.secondary", "&.Mui-selected": { color: "text.primary" } }}
                />
                <Tab
                    label="Created Recipes"
                    value="created"
                    sx={{ color: "text.secondary", "&.Mui-selected": { color: "text.primary" } }}
                />
            </Tabs>

            {/* Search */}
            <TextField
                placeholder="Search your recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                sx={{
                    mb: 4,
                    input: { color: "text.primary" },
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "primary.main" },
                        "&:hover fieldset": { borderColor: "primary.light" }
                    }
                }}
            />

            {/* Error */}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {/* Loading */}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                    <CircularProgress sx={{ color: "primary.main" }} />
                </Box>
            )}

            {/* Empty */}
            {!loading && !error && recipes.length === 0 && (
                <Typography sx={{ textAlign: "center", color: "text.secondary", mt: 6 }}>
                    No recipes found.
                </Typography>
            )}

            {/* Grid */}
            {!loading && !error && recipes.length > 0 && (
                <Grid container spacing={3}>
                    {recipes.map((recipe) => (
                        <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                            <RecipeCard
                                id={recipe.id}
                                title={recipe.title}
                                imageUrl={recipe.imageUrl}
                                cookTimeMinutes={recipe.cookTimeMinutes}
                                difficulty={recipe.difficulty}
                                rating={recipe.rating}
                                cuisine={recipe.cuisine}
                                isUserRecipe={recipe.source === "user"}
                                authorName={recipe.authorName}
                                status={recipe.status}
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
                        onChange={(e, v) => setPage(v)}
                    />
                </Box>
            )}

            {/* FAB */}
            <Fab
                component={Link}
                to="/create-recipe"
                sx={{
                    position: "fixed",
                    bottom: 32,
                    right: 32,
                    backgroundColor: "primary.main",
                    color: "secondary.main"
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
}

export default MyRecipes;