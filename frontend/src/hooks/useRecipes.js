import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

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

  // Fetch official recipes from backend
  const fetchOfficial = useCallback(async (pageNum) => {
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
      const res = await fetch(`http://localhost:5001/api/recipes/official?limit=${LIMIT}&skip=${skip}&q=${search}`);
      if (!res.ok) throw new Error("Failed to fetch recipes");
      const data = await res.json();
      cache[cacheKey] = { recipes: data.recipes, total: data.total };
      setRecipes(data.recipes);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  // Fetch published user recipes from Firestore
  const fetchUserRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "recipes"), where("status", "==", "published"));
      const snapshot = await getDocs(q);
      let data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Filter by search term if any
      if (search.trim()) {
        data = data.filter((r) =>
          r.title?.toLowerCase().includes(search.toLowerCase())
        );
      }
      setRecipes(data);
      setTotal(data.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (tab === "official") {
      const timer = setTimeout(() => fetchOfficial(page), 300);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => fetchUserRecipes(), 300);
      return () => clearTimeout(timer);
    }
  }, [page, tab, search, fetchOfficial, fetchUserRecipes]);

  const totalPages = Math.ceil(total / LIMIT);

  return { recipes, loading, error, search, setSearch, tab, setTab, page, setPage, totalPages };
}