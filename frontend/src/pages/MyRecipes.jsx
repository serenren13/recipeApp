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
    Fab,
    MenuItem,
    Select
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { useMyRecipes } from "../hooks/useMyRecipes";
import RecipeCard from "../components/RecipeCard";

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
        totalPages,
        sortOrder,
        setSortOrder
    } = useMyRecipes();

    return (
        <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", px: 4, py: 4 }}>

            {/* Tabs */}
            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Saved Recipes" value="saved" />
                <Tab label="Created Recipes" value="created" />
            </Tabs>

            {/* Search + Sort */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>

                <TextField
                    placeholder="Search your recipes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                />

                <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    size="small"
                    sx={{ minWidth: 180 }}
                >
                    <MenuItem value="newest">Most Recent</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                </Select>

            </Box>

            {/* Error */}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Loading */}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Empty */}
            {!loading && !error && recipes.length === 0 && (
                <Typography sx={{ textAlign: "center", mt: 6 }}>
                    No recipes found.
                </Typography>
            )}

            {/* LIST (VERTICAL STACK) */}
            {!loading && recipes.length > 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            id={recipe.id}
                            title={recipe.title}
                            imageUrl={recipe.imageUrl}
                            cookTimeMinutes={recipe.cookTimeMinutes}
                            difficulty={recipe.difficulty}
                            cuisine={recipe.cuisine}
                            isUserRecipe={recipe.source === "user"}
                            authorName={recipe.authorName}
                            status={recipe.status}
                            rating={recipe.rating}
                            reviewCount={recipe.reviewCount}
                        />
                    ))}
                </Box>
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
                    right: 32
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
}

export default MyRecipes;