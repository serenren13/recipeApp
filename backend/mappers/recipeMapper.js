// Converts a raw DummyJSON recipe object into the app's standard recipe shape.
// All other layers in the app work with this shape — never raw DummyJSON fields.
function mapRecipe(raw) {
  return {
    id: raw.id,
    externalId: raw.id,
    source: 'dummyjson',
    title: raw.name,
    imageUrl: raw.image,
    ingredients: raw.ingredients,
    instructions: raw.instructions,
    cuisine: raw.cuisine,
    difficulty: raw.difficulty,
    prepTimeMinutes: raw.prepTimeMinutes,
    cookTimeMinutes: raw.cookTimeMinutes,
    servings: raw.servings,
    caloriesPerServing: raw.caloriesPerServing,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    tags: raw.tags,
    mealType: raw.mealType,
  };
}

// Maps a paginated DummyJSON list response (recipes[], total, skip, limit)
function mapRecipeList(rawResponse) {
  return {
    recipes: rawResponse.recipes.map(mapRecipe),
    total: rawResponse.total,
    skip: rawResponse.skip,
    limit: rawResponse.limit,
  };
}

module.exports = { mapRecipe, mapRecipeList };
