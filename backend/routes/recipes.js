const express = require('express');
const router = express.Router();

// GET /api/recipes/search?q=<query>
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query parameter "q" is required' });

  // TODO: integrate recipe API (e.g. Spoonacular, Edamam)
  res.json({ message: `Recipe search for "${q}" — API integration coming soon`, results: [] });
});

// GET /api/recipes/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  // TODO: fetch single recipe by id from recipe API
  res.json({ message: `Recipe detail for id ${id} — API integration coming soon`, recipe: null });
});

module.exports = router;
