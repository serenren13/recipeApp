import { Box, Chip } from "@mui/material";
import { chipActiveSx } from "../styles/styles";

const COOK_TIME_LABELS = {
    under15: "Under 15 min",
    "15to30": "15-30 min",
    "30plus": "30+ min",
};

export default function ActiveFilterChips({ activeFilters, clearFilter }) {
    const hasActiveFilters = Object.values(activeFilters).some((v) => v !== "" && v !== null);

    if (!hasActiveFilters) return null;

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {activeFilters.cuisine && (
                <Chip
                    label={`🍽 ${activeFilters.cuisine}`}
                    onDelete={() => clearFilter("cuisine")}
                    size="small"
                    sx={chipActiveSx}
                />
            )}
            {activeFilters.mealType && (
                <Chip
                    label={`🕐 ${activeFilters.mealType}`}
                    onDelete={() => clearFilter("mealType")}
                    size="small"
                    sx={chipActiveSx}
                />
            )}
            {activeFilters.cookTime && (
                <Chip
                    label={`⏱ ${COOK_TIME_LABELS[activeFilters.cookTime]}`}
                    onDelete={() => clearFilter("cookTime")}
                    size="small"
                    sx={chipActiveSx}
                />
            )}
            {activeFilters.rating && (
                <Chip
                    label={`⭐ ${activeFilters.rating}+ stars`}
                    onDelete={() => clearFilter("rating")}
                    size="small"
                    sx={chipActiveSx}
                />
            )}
        </Box>
    )
}