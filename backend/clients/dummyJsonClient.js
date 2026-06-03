const BASE_URL = 'https://dummyjson.com/recipes';

async function fetchAllRecipes({ limit = 30, skip = 0 } = {}) {
  const url = `${BASE_URL}?limit=${limit}&skip=${skip}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DummyJSON error: ${res.status}`);
  return res.json();
}

async function fetchRecipesBySearch(q, { limit = 30, skip = 0 } = {}) {
  const url = `${BASE_URL}/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DummyJSON error: ${res.status}`);
  return res.json();
}

async function fetchRecipeById(id) {
  const url = `${BASE_URL}/${id}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error(`Recipe with id ${id} not found`);
    err.status = 404;
    throw err;
  }
  return res.json();
}

async function fetchRecipesByTag(tag, { limit = 30, skip = 0 } = {}) {
  const url = `${BASE_URL}/tag/${encodeURIComponent(tag)}?limit=${limit}&skip=${skip}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DummyJSON error: ${res.status}`);
  return res.json();
}

async function fetchRecipesByMealType(mealType, { limit = 30, skip = 0 } = {}) {
  const url = `${BASE_URL}/meal-type/${encodeURIComponent(mealType)}?limit=${limit}&skip=${skip}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DummyJSON error: ${res.status}`);
  return res.json();
}

async function fetchAllTags() {
  const url = `${BASE_URL}/tags`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DummyJSON error: ${res.status}`);
  return res.json();
}

module.exports = {
  fetchAllRecipes,
  fetchRecipesBySearch,
  fetchRecipeById,
  fetchRecipesByTag,
  fetchRecipesByMealType,
  fetchAllTags,
};
