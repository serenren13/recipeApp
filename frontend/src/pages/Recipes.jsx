import { Box, Typography, TextField, Tab, Tabs, Grid, Pagination, CircularProgress, Alert, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { useRecipes } from "../hooks/useRecipes";
import { useFilters } from "../hooks/useFilters";
import RecipeCard from "../components/RecipeCard";
import FilterPanel from "../components/FilterPanel";
import ActiveFilterChips from "../components/ActiveFilterChips";
import { pageWrapperSx, textFieldSx } from "../styles/styles";

function Recipes() {
    const {
        activeFilters,
        pendingFilters,
        setPending,
        applyFilters,
        resetFilters,
        clearFilter,
        activeFilterCount,
        panelOpen,
        setPanelOpen,
    } = useFilters();

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
    } = useRecipes(activeFilters);

    return (
        <Box sx={pageWrapperSx}>

            {/* Toggle */}
            <Tabs
                value={tab}
                onChange={(e, newVal) => setTab(newVal)}
                sx={{ mb: 3 }}
                slotProps={{ style: { backgroundColor: "#7AE2CF" } }}
            >
                <Tab label="Official Recipes" value="official" />
                <Tab label="User Recipes" value="user" />
            </Tabs>

            {/* Search + Filter Row */}
            <Box sx={{ display: "flex", gap: 2, mb: 4, alignItems: "center" }}>
                <TextField
                    placeholder="Search recipes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    sx={textFieldSx}
                />
                <FilterPanel
                    pendingFilters={pendingFilters}
                    setPending={setPending}
                    applyFilters={applyFilters}
                    resetFilters={resetFilters}
                    activeFilterCount={activeFilterCount}
                    panelOpen={panelOpen}
                    setPanelOpen={setPanelOpen}
                />
            </Box>

            <ActiveFilterChips activeFilters={activeFilters} clearFilter={clearFilter} />

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