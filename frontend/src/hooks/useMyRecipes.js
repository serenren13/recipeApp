import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, where, getDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { getOfficialRecipeById } from "../api/recipeApi";

export function useMyRecipes() {
    const { user } = useAuth();

    const [tab, setTab] = useState("saved");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

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
                collection(db, "users", user.uid, "savedRecipes"),
                async (snap) => {
                    try {
                        const refs = snap.docs.map(d => d.data());

                        const full = await Promise.all(
                            refs.map(async (r) => {
                                if (r.source === "api") {
                                    const api = await getOfficialRecipeById(r.recipeId);
                                    return { ...api, id: r.recipeId, source: "api" };
                                }

                                const fsDoc = await getDoc(doc(db, "recipes", r.recipeId));
                                if (!fsDoc.exists()) return null;

                                return {
                                    id: fsDoc.id,
                                    ...fsDoc.data(),
                                    source: "user"
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

    const filtered = recipes.filter(r =>
        (r.title || "").toLowerCase().includes(search.toLowerCase())
    );

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
        totalPages
    };
}