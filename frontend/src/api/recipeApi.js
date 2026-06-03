const BASE_URL = '/api/recipes/official';

// Fetch a list of official recipes.
// Options:
//   q         — search term (e.g. "chicken")
//   tag       — filter by tag (e.g. "Italian")
//   mealType  — filter by meal type (e.g. "dinner")
//   limit     — number of results (default 30)
//   skip      — offset for pagination (default 0)
//
// Returns: { recipes: [...], total, skip, limit }
export async function getOfficialRecipes({ q, tag, mealType, limit = 30, skip = 0 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (tag) params.set('tag', tag);
  if (mealType) params.set('mealType', mealType);
  params.set('limit', limit);
  params.set('skip', skip);

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch recipes: ${res.status}`);
  return res.json();
}

// Fetch a single official recipe by its id.
// Returns a full recipe object matching the app's standard shape.
export async function getOfficialRecipeById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch recipe ${id}: ${res.status}`);
  return res.json();
}

// Fetch all available recipe tags.
// Returns an array of tag strings.
export async function getOfficialTags() {
  const res = await fetch(`${BASE_URL}/tags`);
  if (!res.ok) throw new Error(`Failed to fetch tags: ${res.status}`);
  return res.json();
}
