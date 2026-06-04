import {
    Box, Button, Typography, Chip, Divider, Paper, Rating
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { getOfficialCuisines } from "../api/recipeApi";
import { chipActiveSx, chipOutlinedSx } from "../styles/styles";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Appetizer"];

const COOK_TIMES = [
    { label: "Under 15 min", value: "under15" },
    { label: "15-30 min", value: "15to30" },
    { label: "30+ min", value: "30plus" },
];

export default function FilterPanel({
    pendingFilters,
    setPending,
    applyFilters,
    resetFilters,
    activeFilterCount,
    panelOpen,
    setPanelOpen,
}) {
    const [cuisines, setCuisines] = useState([]);

    useEffect(() => {
        getOfficialCuisines().then(setCuisines).catch(console.error);
    }, []);

    return (
        <Box sx={{ position: "relative" }}>

            {/* Filter Button */}
            <Button
                onClick={() => setPanelOpen(!panelOpen)}
                startIcon={<TuneIcon />}
                variant={activeFilterCount > 0 ? "contained" : "outlined"}
                sx={{
                    color: activeFilterCount > 0 ? "secondary.main" : "text.secondary",
                    borderColor: "primary.main",
                }}
            >
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>

            {/* Dropdown Panel */}
            {panelOpen && (
                <Paper
                    elevation={4}
                    sx={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        left: 0,
                        zIndex: 100,
                        width: 360,
                        p: 3,
                        backgroundColor: "background.paper",
                        border: "1px solid",
                        borderColor: "primary.main",
                        borderRadius: "12px",
                    }}
                >
                    {/* Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 700 }}>
                            Filters
                        </Typography>
                        <CloseIcon
                            onClick={() => setPanelOpen(false)}
                            sx={{ color: "text.secondary", cursor: "pointer" }}
                        />
                    </Box>

                    {/* Cuisine */}
                    <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 1 }}>
                        Cuisine
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                        {cuisines.map((c) => (
                            <Chip
                                key={c}
                                label={c}
                                onClick={() => setPending("cuisine", c)}
                                variant={pendingFilters.cuisine === c ? "filled" : "outlined"}
                                size="small"
                                sx={pendingFilters.cuisine === c ? chipActiveSx : chipOutlinedSx}
                            />
                        ))}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Meal Type */}
                    <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 1}}>
                        Meal Type
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                        {MEAL_TYPES.map((m) => (
                            <Chip
                                key={m}
                                label={m}
                                onClick={() => setPending("mealType", m.toLowerCase())}
                                variant={pendingFilters.mealType === m.toLowerCase() ? "filled" : "outlined"}
                                size="small"
                                sx={pendingFilters.mealType === m.toLowerCase ? chipActiveSx : chipOutlinedSx}
                            />
                        ))}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Cook Time */}
                    <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 1 }}>
                        Cook Time
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                        {COOK_TIMES.map((t) => (
                            <Chip
                                key={t.value}
                                label={t.label}
                                onClick={() => setPending("cookTime", t.value)}
                                variant={pendingFilters.cookTime === t.value ? "filled" : "outlined"}
                                size="small"
                                sx={pendingFilters.cookTime === t.value ? chipActiveSx : chipOutlinedSx}
                            />
                        ))}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Minimum Rating */}
                    <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 1 }}>
                        Minimum Rating
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                        <Rating
                            value={pendingFilters.rating ?? 0}
                            precision={0.5}
                            onChange={(e, val) => setPending("rating", val)}
                            sx={{ color: "secondary.main" }}
                        />
                        {pendingFilters.rating && (
                            <Typography variant="caption" sx={{ color: "text.secondary", ml: 1 }}>
                                {pendingFilters.rating}+ stars
                            </Typography>
                        )}
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button
                            onClick={resetFilters}
                            variant="outlined"
                            size="small"
                            sx={{ borderColor: "text.secondary", color: "text.secondary" }}
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={applyFilters}
                            size="small"
                            color="primary"
                        >
                            Apply Filters
                        </Button>
                    </Box>
                </Paper>
            )}
        </Box>
    );
}