import { useState, useMemo } from "react";

const DEFAULT_FILTERS ={
    cuisine: "",
    mealType: "",
    cookTime: "",
    rating: null,
};

export function useFilters() {
    const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
    const [pendingFilters, setPendingFilters] = useState(DEFAULT_FILTERS);
    const [panelOpen, setPanelOpen] = useState(false);

    const setPending = (key, value) => {
        setPendingFilters((prev) => ({
            ...prev,
            [key]: prev[key] === value ? "" : value,
        }));
    };

    const applyFilters = () => {
        setActiveFilters(pendingFilters);
        setPanelOpen(false);
    };

    const resetFilters = () => {
        setPendingFilters(DEFAULT_FILTERS);
        setActiveFilters(DEFAULT_FILTERS);
        setPanelOpen(false);
    };

    const clearFilter = (key) => {
        setActiveFilters((prev) => ({ ...prev, [key]: key === "rating" ? null : "" }));
        setPendingFilters((prev) => ({ ...prev, [key]: key === "rating" ? null : "" }));
    };

    const activeFilterCount = useMemo(() => {
        return Object.values(activeFilters).filter((v) => v !== "" && v !== null).length;
    }, [activeFilters]);

    return {
        activeFilters,
        pendingFilters,
        setPending,
        applyFilters,
        resetFilters,
        clearFilter,
        activeFilterCount,
        panelOpen,
        setPanelOpen,
    };
}