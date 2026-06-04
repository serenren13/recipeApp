const recipeService = require('../services/recipeService');

// GET /api/recipes/official
// GET /api/recipes/official?q=chicken
// GET /api/recipes/official?tag=Italian
// GET /api/recipes/official?mealType=dinner
// GET /api/recipes/official?limit=10&skip=10
async function getOfficialRecipes(req, res, next) {
  try {
    const { q, tag, mealType, limit, skip } = req.query;
    const result = await recipeService.getOfficialRecipes({
      q,
      tag,
      mealType,
      limit: limit ? parseInt(limit) : 30,
      skip: skip ? parseInt(skip) : 0,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /api/recipes/official/:id
async function getOfficialRecipeById(req, res, next) {
  try {
    const { id } = req.params;
    const recipe = await recipeService.getOfficialRecipeById(id);
    res.json(recipe);
  } catch (err) {
    next(err);
  }
}

// GET /api/recipes/official/tags
async function getOfficialTags(req, res, next) {
  try {
    const tags = await recipeService.getOfficialTags();
    res.json(tags);
  } catch (err) {
    next(err);
  }
}

// GET /api/recipes/official/cuisines
async function getOfficialCuisines(req, res, next) {
  try {
    const cuisines = await recipeService.getOfficialCuisines();
    res.json(cuisines);
  } catch (err) {
    next(err);
  }
}

module.exports = { getOfficialRecipes, getOfficialRecipeById, getOfficialTags, getOfficialCuisines };
