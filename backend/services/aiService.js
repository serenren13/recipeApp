const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Builds the system prompt using the recipe JSON so the AI knows the full context
function buildSystemPrompt(recipe) {
  return `You are a helpful cooking assistant for the recipe app. You are helping a user with the following recipe:

Name: ${recipe.title}
Cuisine: ${recipe.cuisine ?? 'Unknown'}
Difficulty: ${recipe.difficulty ?? 'Unknown'}
Prep Time: ${recipe.prepTimeMinutes ?? '?'} minutes
Cook Time: ${recipe.cookTimeMinutes ?? '?'} minutes
Servings: ${recipe.servings ?? '?'}
Calories per serving: ${recipe.caloriesPerServing ?? '?'}

Ingredients:
${recipe.ingredients?.map((ing) => `- ${ing}`).join('\n') ?? 'Not available'}

Instructions:
${recipe.instructions?.map((step, i) => `${i + 1}. ${step}`).join('\n') ?? 'Not available'}

Tags: ${recipe.tags?.join(', ') ?? 'None'}
Meal Type: ${recipe.mealType?.join(', ') ?? 'Unknown'}

You can help with:
- Ingredient substitutions and swaps
- Scaling the recipe up or down
- Technique questions
- Dietary modifications (vegan, gluten-free, etc.)
- Storage and reheating tips
- Pairing suggestions

Keep your answers concise, practical, and focused on this recipe. If asked something unrelated to cooking or this recipe, politely redirect the conversation.`;
}

// messages: array of { role: 'user' | 'assistant', content: string }
// recipe: the full recipe object from the app's standard shape
async function chat(messages, recipe) {
  const systemPrompt = buildSystemPrompt(recipe);

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

module.exports = { chat };
