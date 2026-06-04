const aiService = require('../services/aiService');

// POST /api/ai/chat
// Body: { messages: [{ role, content }], recipe: { ...recipeObject } }
async function chat(req, res, next) {
  try {
    const { messages, recipe } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    if (!recipe || !recipe.title) {
      return res.status(400).json({ error: 'recipe object is required' });
    }

    const reply = await aiService.chat(messages, recipe);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
}

module.exports = { chat };
