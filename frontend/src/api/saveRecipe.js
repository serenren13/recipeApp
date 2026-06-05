import { addDoc, collection, deleteDoc, doc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// SAVE
export async function saveRecipe(userId, recipe, source) {
    const ref = collection(db, "users", userId, "savedRecipes");

    // prevent duplicates
    const q = query(ref, where("recipeId", "==", recipe.id));
    const snap = await getDocs(q);

    if (!snap.empty) return;

    await addDoc(ref, {
        recipeId: recipe.id,
        source,
        savedAt: serverTimestamp()
    });
}

// UNSAVE
export async function unsaveRecipe(userId, recipeId) {
    const ref = collection(db, "users", userId, "savedRecipes");

    const q = query(ref, where("recipeId", "==", recipeId));
    const snap = await getDocs(q);

    snap.forEach(async (d) => {
        await deleteDoc(doc(db, "users", userId, "savedRecipes", d.id));
    });
}