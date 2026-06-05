import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { getOfficialRecipes } from "../api/recipeApi";

const LIMIT = 12;

// When any filter is active we fetch a large batch from the server and
// paginate the client-filtered results ourselves.  DummyJSON has ~50
// recipes, so 100 is a safe upper bound.
const FETCH_ALL_LIMIT = 100;

// ---------------------------------------------------------------------------
// Client-side filtering
// Applies filters that DummyJSON doesn't support server-side (cookTime,
// rating) and any secondary filter that couldn't be sent to the server.
// ---------------------------------------------------------------------------
function applyClientFilters(recipes, activeFilters, search, serverFilter) {
    let result = [...recipes];

    // Search — only client-side when a cuisine/mealType was the server filter
    if (search && serverFilter !== "search") {
        result = result.filter(r =>
            (r.title ?? "").toLowerCase().includes(search.toLowerCase())
        );
    }

    // mealType — only client-side when cuisine was the server filter
    if (activeFilters.mealType && serverFilter !== "mealType") {
        result = result.filter(r => {
            const types = Array.isArray(r.mealType)
                ? r.mealType
                : [r.mealType].filter(Boolean);
            return types.some(m => m.toLowerCase() === activeFilters.mealType.toLowerCase());
        });
    }

    // cookTime — always client-side (DummyJSON has no API support)
    if (activeFilters.cookTime === "under15") {
        result = result.filter(r => (r.cookTimeMinutes ?? 99) < 15);
    } else if (activeFilters.cookTime === "15to30") {
        result = result.filter(r =>
            (r.cookTimeMinutes ?? 0) >= 15 && (r.cookTimeMinutes ?? 0) <= 30
        );
    } else if (activeFilters.cookTime === "30plus") {
        result = result.filter(r => (r.cookTimeMinutes ?? 0) > 30);
    }

    // rating — always client-side
    if (activeFilters.rating) {
        result = result.filter(r => (r.rating ?? 0) >= activeFilters.rating);
    }

    return result;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useRecipes(activeFilters = {}) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState("official");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Reset to page 1 whenever filters, search, or tab change
    useEffect(() => {
        setPage(1);
    }, [activeFilters, search, tab]);

    // ------------------------------------------------------------------
    // Official recipes (DummyJSON via backend proxy)
    // ------------------------------------------------------------------
    const fetchOfficial = useCallback(async (pageNum) => {
        setLoading(true);
        setError(null);

        try {
            let serverParams = {};
            let serverFilter = null;

            // Pick the single server-side filter with highest priority:
            // cuisine (as tag) > mealType > search > none
            if (activeFilters.cuisine) {
                serverParams.tag = activeFilters.cuisine;
                serverFilter = "cuisine";
            } else if (activeFilters.mealType) {
                serverParams.mealType = activeFilters.mealType;
                serverFilter = "mealType";
            } else if (search) {
                serverParams.q = search;
                serverFilter = "search";
            }

            const hasAnyFilter =
                serverFilter !== null ||
                activeFilters.cookTime ||
                activeFilters.rating;

            if (hasAnyFilter) {
                // Fetch the full matching set so we can paginate after
                // applying client-side filters
                serverParams.limit = FETCH_ALL_LIMIT;
                serverParams.skip = 0;
            } else {
                // No filters at all — let the server handle pagination
                serverParams.limit = LIMIT;
                serverParams.skip = (pageNum - 1) * LIMIT;
            }

            const data = await getOfficialRecipes(serverParams);

            if (hasAnyFilter) {
                const filtered = applyClientFilters(data.recipes, activeFilters, search, serverFilter);
                const start = (pageNum - 1) * LIMIT;
                setRecipes(filtered.slice(start, start + LIMIT));
                setTotal(filtered.length);
            } else {
                setRecipes(data.recipes);
                setTotal(data.total);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [search, activeFilters]);

    // ------------------------------------------------------------------
    // User recipes (Firestore, published only)
    // ------------------------------------------------------------------
    const fetchUserRecipes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const q = query(collection(db, "recipes"), where("status", "==", "published"));
            const snapshot = await getDocs(q);
            let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

            // Text search
            if (search.trim()) {
                data = data.filter(r =>
                    (r.title ?? "").toLowerCase().includes(search.toLowerCase())
                );
            }

            // Cuisine
            if (activeFilters.cuisine) {
                data = data.filter(r =>
                    (r.cuisine ?? "").toLowerCase() === activeFilters.cuisine.toLowerCase()
                );
            }

            // Meal type
            if (activeFilters.mealType) {
                data = data.filter(r => {
                    const types = Array.isArray(r.mealType)
                        ? r.mealType
                        : [r.mealType].filter(Boolean);
                    return types.some(m =>
                        (m ?? "").toLowerCase() === activeFilters.mealType.toLowerCase()
                    );
                });
            }

            // Cook time
            if (activeFilters.cookTime === "under15") {
                data = data.filter(r => (r.cookTimeMinutes ?? 99) < 15);
            } else if (activeFilters.cookTime === "15to30") {
                data = data.filter(r =>
                    (r.cookTimeMinutes ?? 0) >= 15 && (r.cookTimeMinutes ?? 0) <= 30
                );
            } else if (activeFilters.cookTime === "30plus") {
                data = data.filter(r => (r.cookTimeMinutes ?? 0) > 30);
            }

            // Rating
            if (activeFilters.rating) {
                data = data.filter(r => (r.rating ?? 0) >= activeFilters.rating);
            }

            setRecipes(data);
            setTotal(data.length);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [search, activeFilters]);

    // ------------------------------------------------------------------
    // Trigger fetch on page / tab / search / filter changes
    // ------------------------------------------------------------------
    useEffect(() => {
        if (tab === "official") {
            const timer = setTimeout(() => fetchOfficial(page), 300);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => fetchUserRecipes(), 300);
            return () => clearTimeout(timer);
        }
    }, [page, tab, fetchOfficial, fetchUserRecipes]);

    const totalPages = Math.ceil(total / LIMIT);

    return { recipes, loading, error, search, setSearch, tab, setTab, page, setPage, totalPages };
}
