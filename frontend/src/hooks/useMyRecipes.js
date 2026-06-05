import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
    collection,
    onSnapshot,
    query,
    where,
    getDoc,
    doc
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { getOfficialRecipeById } from "../api/recipeApi";

export function useMyRecipes() {
    const { user } = useAuth();

    const [tab, setTab] = useState("saved");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [sortOrder, setSortOrder] = useState("newest");

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const PAGE_SIZE = 9;

    useEffect(() => {
        if (!user?.uid) return;

        setLoading(true);
        setError("");

        let unsub;

        // -------------------
        // CREATED RECIPES
        // -------------------
        if (tab === "created") {
            const q = query(
                collection(db, "recipes"),
                where("authorId", "==", user.uid)
            );

            unsub = onSnapshot(
                q,
                (snap) => {
                    const data = snap.docs.map(d => ({
                        id: d.id,
                        ...d.data(),
                        source: "user"
                    }));

                    setRecipes(data);
                    setLoading(false);
                },
                (err) => {
                    setError(err.message);
                    setLoading(false);
                }
            );
        }

        // -------------------
        // SAVED RECIPES
        // -------------------
        if (tab === "saved") {
            unsub = onSnapshot(
                query(collection(db, "users", user.uid, "savedRecipes")),
                async (snap) => {
                    try {
                        const refs = snap.docs.map(d => d.data());

                        const full = await Promise.all(
                            refs.map(async (r) => {

                                if (r.source === "api") {
                                    const api = await getOfficialRecipeById(r.recipeId);

                                    return {
                                        ...api,
                                        id: r.recipeId,
                                        source: "api",
                                        savedAt: r.savedAt || null
                                    };
                                }

                                const fsDoc = await getDoc(doc(db, "recipes", r.recipeId));
                                if (!fsDoc.exists()) return null;

                                return {
                                    id: fsDoc.id,
                                    ...fsDoc.data(),
                                    source: "user",
                                    savedAt: r.savedAt || null
                                };
                            })
                        );

                        setRecipes(full.filter(Boolean));
                        setLoading(false);
                    } catch (e) {
                        setError(e.message);
                        setLoading(false);
                    }
                }
            );
        }

        return () => unsub?.();
    }, [user?.uid, tab]);

    // -------------------
    // SEARCH
    // -------------------
    let filtered = recipes.filter(r =>
        (r.title || "").toLowerCase().includes(search.toLowerCase())
    );

    // -------------------
    // SORT (FIXED)
    // -------------------
    filtered = filtered.sort((a, b) => {

        const getTime = (r) => {
            if (tab === "saved") {
                return r.savedAt?.seconds ?? 0;     // ✅ saved time
            }
            return r.createdAt?.seconds ?? 0;       // ✅ created time
        };

        const aTime = getTime(a);
        const bTime = getTime(b);

        return sortOrder === "newest"
            ? bTime - aTime
            : aTime - bTime;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    const paginated = filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    return {
        recipes: paginated,
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
    };
}