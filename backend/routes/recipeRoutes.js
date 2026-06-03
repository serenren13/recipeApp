const express = require('express');
const router = express.Router();
const controller = require('../controllers/recipeController');

// GET /api/recipes/official/tags  — must be above /:id to avoid being caught as an id param
router.get('/official/tags', controller.getOfficialTags);

// GET /api/recipes/official/cuisines - also must be above /:id to avoid being caught as an id param
router.get('/official/cuisines', controller.getOfficialCuisines);

// GET /api/recipes/official        — all recipes, with optional ?q= ?tag= ?mealType= ?limit= ?skip=
// GET /api/recipes/official?q=chicken
router.get('/official', controller.getOfficialRecipes);

// GET /api/recipes/official/:id
router.get('/official/:id', controller.getOfficialRecipeById);

module.exports = router;
