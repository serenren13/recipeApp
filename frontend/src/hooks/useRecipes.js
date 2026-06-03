import { useState, useEffect, useCallback } from "react";
import { getOfficialRecipes } from "../api/recipeApi";

const LIMIT = 12;
const cache = {};

export function useRecipes(activeFilters) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState("official");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // fetch with caching
    const fetchRecipes = useCallback(async (pageNum) => {
        const skip = (pageNum - 1) * LIMIT;
        const cacheKey = `recipes-${pageNum}-${search}-${JSON.stringify(activeFilters)}`;

        setLoading(true);
        setError(null);

        try {
            if (cache[cacheKey]) {
                setRecipes(cache[cacheKey].recipes);
                setTotal(cache[cacheKey].total);
                setLoading(false);
                return;
            }

            const data = await getOfficialRecipes({ 
                limit: LIMIT, 
                skip,
                q: search || undefined,
                tag: activeFilters?.cuisine || undefined,
                mealType: activeFilters?.mealType || undefined,
            });

            // TODO: move cookTime and rating filters to backend endpoint
            // client-side filtering for cookTime and rating
            let filtered = data.recipes;

            if (activeFilters?.cookTime) {
                filtered = filtered.filter((r) => {
                    const cookTimeTotal = (r.prepTimeMinutes ?? 0) + (r.cookTimeMinutes ?? 0);
                    if (activeFilters.cookTime === "under15") return cookTimeTotal < 15;
                    if (activeFilters.cookTime === "15to30") return cookTimeTotal >= 15 && cookTimeTotal <= 30;
                    if (activeFilters.cookTime === "30plus") return cookTimeTotal > 30;
                    return true;
                });
            }

            if (activeFilters?.rating) {
                filtered = filtered.filter((r) => r.rating >= activeFilters.rating);
            }

            cache[cacheKey] = { recipes: filtered, total: data.total };
            setRecipes(filtered);
            setTotal(data.total);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [search, activeFilters]);

    // fetch on page change
    useEffect(() => {
        if (tab === "official") {
            const timer = setTimeout(() => {
                fetchRecipes(page);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [page, tab, search,activeFilters, fetchRecipes]);

    // reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [activeFilters]);

const totalPages = Math.ceil(total / LIMIT);

return {
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
};

}