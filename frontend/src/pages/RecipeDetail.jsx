import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

import { getOfficialRecipeById } from '../api/recipeApi';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

import CommentsSection from '../components/CommentsSection';
import RecipeChat from '../components/RecipeChat';
import { useAuth } from '../context/AuthContext';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserRecipe, setIsUserRecipe] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // -----------------------
  // LOAD RECIPE
  // -----------------------
  useEffect(() => {
    setLoading(true);
    setError(null);

    const isOfficial = /^\d+$/.test(id);

    if (isOfficial) {
      setIsUserRecipe(false);

      getOfficialRecipeById(id)
        .then(setRecipe)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));

    } else {
      setIsUserRecipe(true);

      getDoc(doc(db, 'recipes', id))
        .then((snap) => {
          if (!snap.exists()) throw new Error('Recipe not found.');

          const data = snap.data();

          setRecipe({
            id: snap.id,
            title: data.title,
            imageUrl: data.imageUrl,
            ingredients: typeof data.ingredients === 'string'
              ? data.ingredients.split('\n').filter(Boolean)
              : data.ingredients || [],
            instructions: typeof data.instructions === 'string'
              ? data.instructions.split('\n').filter(Boolean)
              : data.instructions || [],
            authorName: data.authorName || 'Unknown',
            status: data.status,
            prepTimeMinutes: data.prepTimeMinutes,
            cookTimeMinutes: data.cookTimeMinutes,
            difficulty: data.difficulty,
            servings: data.servings,
            caloriesPerServing: data.caloriesPerServing,
            rating: data.rating,
            reviewCount: data.reviewCount,
            cuisine: data.cuisine,
          });
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // -----------------------
  // SAVE RECIPE
  // -----------------------
  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      const savedRef = collection(db, 'users', user.uid, 'savedRecipes');

      // prevent duplicates
      const q = query(savedRef, where('recipeId', '==', id));
      const existing = await getDocs(q);

      if (!existing.empty) {
        setSaved(true);
        setSaving(false);
        return;
      }

      await addDoc(savedRef, {
        recipeId: id,
        source: isUserRecipe ? 'user' : 'api',
        savedAt: serverTimestamp()
      });

      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // -----------------------
  // LOADING / ERROR
  // -----------------------
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#077A7D' }} />
      </Box>
    );
  }

  if (error || !recipe) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography sx={{ color: '#FDEB9E' }}>
          {error ?? 'Recipe not found.'}
        </Typography>
      </Box>
    );
  }

  const totalMinutes =
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);

  const difficultyColor =
    recipe.difficulty === 'Easy'
      ? '#7AE2CF'
      : recipe.difficulty === 'Medium'
      ? '#FDEB9E'
      : '#e57373';

  // -----------------------
  // UI
  // -----------------------
  return (
    <Box sx={{ backgroundColor: '#06202B', minHeight: '100vh', pb: 8 }}>

      {/* Back */}
      <Box sx={{ px: { xs: 2, md: 6 }, pt: 3 }}>
        <Box
          onClick={() => navigate(-1)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            color: '#7AE2CF',
            '&:hover': { color: '#FDEB9E' },
          }}
        >
          <ArrowBackIcon fontSize="small" />
          <Typography variant="body2" fontWeight={600}>Back</Typography>
        </Box>
      </Box>

      {/* Save Button */}
      <Box sx={{ px: { xs: 2, md: 6 }, mt: 2 }}>
        <Button
          onClick={handleSave}
          disabled={saving || saved}
          variant="contained"
          sx={{
            backgroundColor: saved ? '#7AE2CF' : '#077A7D',
            color: '#06202B',
            fontWeight: 700,
            '&:hover': { backgroundColor: '#7AE2CF' }
          }}
        >
          {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save Recipe'}
        </Button>
      </Box>

      {/* Image */}
      {!isUserRecipe && recipe.imageUrl && (
        <Box sx={{ px: { xs: 0, md: 6 }, mt: 2 }}>
          <Box
            component="img"
            src={recipe.imageUrl}
            alt={recipe.title}
            sx={{
              width: '100%',
              height: { xs: 220, sm: 340, md: 420 },
              objectFit: 'cover',
              borderRadius: { xs: 0, md: '16px' },
            }}
          />
        </Box>
      )}

      {/* Title */}
      <Box sx={{ px: { xs: 2, md: 6 }, mt: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: '#FDEB9E' }}>
          {recipe.title}
        </Typography>
      </Box>

      {/* Stats */}
      {!isUserRecipe && (
        <Box sx={{ px: { xs: 2, md: 6 }, mt: 3, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <StatItem icon={<AccessTimeIcon sx={{ color: '#7AE2CF' }} />} label="Total" value={`${totalMinutes} min`} />
          <StatItem icon={<PeopleIcon sx={{ color: '#7AE2CF' }} />} label="Servings" value={recipe.servings} />
          <StatItem icon={<StarIcon sx={{ color: '#FDEB9E' }} />} label="Rating" value={recipe.rating} />
        </Box>
      )}

      <Divider sx={{ mx: { xs: 2, md: 6 }, mt: 3, borderColor: '#077A7D' }} />

      {/* Ingredients + Instructions */}
      <Grid container spacing={3} sx={{ px: { xs: 2, md: 6 }, mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Typography sx={{ color: '#FDEB9E', mb: 1 }}>Ingredients</Typography>
          <ul>
            {recipe.ingredients.map((i, idx) => (
              <li key={idx} style={{ color: '#7AE2CF' }}>{i}</li>
            ))}
          </ul>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography sx={{ color: '#FDEB9E', mb: 1 }}>Instructions</Typography>
          {recipe.instructions.map((step, i) => (
            <Typography key={i} sx={{ color: '#FDEB9E', mb: 1 }}>
              {i + 1}. {step}
            </Typography>
          ))}
        </Grid>
      </Grid>

      {/* Comments */}
      <Box sx={{ px: { xs: 2, md: 6 }, mt: 5 }}>
        <CommentsSection recipeKey={isUserRecipe ? `user_${id}` : `official_${id}`} />
      </Box>

      <RecipeChat recipe={recipe} />
    </Box>
  );
}

function StatItem({ icon, label, value }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {icon}
        <Typography sx={{ color: '#7AE2CF', fontSize: 12 }}>{label}</Typography>
      </Box>
      <Typography sx={{ color: '#FDEB9E' }}>{value}</Typography>
    </Box>
  );
}