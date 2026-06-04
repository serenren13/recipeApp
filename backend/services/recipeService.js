const client = require('../clients/dummyJsonClient');
const { mapRecipe, mapRecipeList } = require('../mappers/recipeMapper');

// Returns a paginated list of recipes, optionally filtered by search term, tag, or mealType.
async function getOfficialRecipes({ q, tag, mealType, limit = 30, skip = 0 } = {}) {
  let raw;

  if (q) {
    raw = await client.fetchRecipesBySearch(q, { limit, skip });
  } else if (tag) {
    raw = await client.fetchRecipesByTag(tag, { limit, skip });
  } else if (mealType) {
    raw = await client.fetchRecipesByMealType(mealType, { limit, skip });
  } else {
    raw = await client.fetchAllRecipes({ limit, skip });
  }

  return mapRecipeList(raw);
}

// Returns the full detail for a single official recipe by its id.
async function getOfficialRecipeById(id) {
  const raw = await client.fetchRecipeById(id);
  return mapRecipe(raw);
}

// Returns the full list of available recipe tags.
async function getOfficialTags() {
  return client.fetchAllTags();
}

// Returns a curated list of cuisine-level tags only
async function getOfficialCuisines() {
  const allTags = await client.fetchAllTags();
  const CUISINE_TAGS = [
    "Italian", "Asian", "Indian", "Mexican", "Japanese",
    "Korean", "Greek", "Thai", "Lebanese", "Mediterranean",
    "Pakistani", "Moroccan", "Vietnamese", "Turkish", "Brazilian",
    "Spanish", "Cuban", "Hawaiian"
  ];
  return allTags.filter((tag) => CUISINE_TAGS.includes(tag));
}

module.exports = { getOfficialRecipes, getOfficialRecipeById, getOfficialTags, getOfficialCuisines };
