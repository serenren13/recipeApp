import { useState, useEffect, useCallback } from "react";
import { getOfficialRecipes } from "../api/recipeApi";

const LIMIT = 12;
const cache = {};

export function useRecipes() {
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
        const cacheKey = `recipes-${pageNum}-${search}`;

        setLoading(true);
        setError(null);

        try {
            if (cache[cacheKey]) {
                setRecipes(cache[cacheKey].recipes);
                setTotal(cache[cacheKey].total);
                setLoading(false);
                return;
            }

            const data = await getOfficialRecipes({ limit: LIMIT, skip, q: search || undefined });

            cache[cacheKey] = { recipes: data.recipes, total: data.total };
            setRecipes(data.recipes);
            setTotal(data.total);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [search]);

    // fetch on page change
    useEffect(() => {
        if (tab === "official") {
            const timer = setTimeout(() => {
                fetchRecipes(page);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [page, tab, search, fetchRecipes]);

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