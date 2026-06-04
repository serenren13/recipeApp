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
import { deleteDoc } from 'firebase/firestore';

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
  let isMounted = true;

  const loadRecipe = async () => {
    setLoading(true);
    setError(null);

    const isOfficial = /^\d+$/.test(id);
    setIsUserRecipe(!isOfficial);

    try {
      let data;

      // -----------------------
      // OFFICIAL RECIPE
      // -----------------------
      if (isOfficial) {
        data = await getOfficialRecipeById(id);

        if (!isMounted) return;

        setRecipe(data);
      }

      // -----------------------
      // USER RECIPE (Firestore)
      // -----------------------
      else {
        const snap = await getDoc(doc(db, 'recipes', id));

        if (!snap.exists()) {
          throw new Error('Recipe not found.');
        }

        const d = snap.data();

        if (!isMounted) return;

        setRecipe({
          id: snap.id,
          title: d.title,
          imageUrl: d.imageUrl,
          ingredients: typeof d.ingredients === 'string'
            ? d.ingredients.split('\n').filter(Boolean)
            : d.ingredients || [],
          instructions: typeof d.instructions === 'string'
            ? d.instructions.split('\n').filter(Boolean)
            : d.instructions || [],
          authorName: d.authorName || 'Unknown',
          status: d.status,
          prepTimeMinutes: d.prepTimeMinutes,
          cookTimeMinutes: d.cookTimeMinutes,
          difficulty: d.difficulty,
          servings: d.servings,
          caloriesPerServing: d.caloriesPerServing,
          rating: d.rating,
          reviewCount: d.reviewCount,
          cuisine: d.cuisine,
        });
      }

      // -----------------------
      // CHECK IF SAVED (ONLY IF USER LOGGED IN)
      // -----------------------
      if (user && isMounted) {
        const savedRef = collection(db, 'users', user.uid, 'savedRecipes');
        const q = query(savedRef, where('recipeId', '==', id));
        const snap = await getDocs(q);

        if (!isMounted) return;

        setSaved(!snap.empty);
      }

    } catch (err) {
      if (isMounted) setError(err.message);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  loadRecipe();

  return () => {
    isMounted = false;
  };
}, [id, user]);

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


  const handleUnsave = async () => {
  if (!user) return;

  try {
    setSaving(true);

    const savedRef = collection(db, 'users', user.uid, 'savedRecipes');

    const q = query(savedRef, where('recipeId', '==', id));
    const snap = await getDocs(q);

    if (snap.empty) return;

    // delete all matching docs (should usually be 1)
    await Promise.all(
      snap.docs.map((docSnap) => deleteDoc(docSnap.ref))
    );

    setSaved(false);
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
          onClick={saved ? handleUnsave : handleSave}
          disabled={saving}
          variant="contained"
          sx={{
            backgroundColor: saved ? '#e57373' : '#077A7D',
            color: '#06202B',
            fontWeight: 700,
            '&:hover': {
              backgroundColor: saved ? '#ef5350' : '#7AE2CF'
            }
          }}
>
  {saving
    ? 'Processing...'
    : saved
    ? 'Unsave Recipe'
    : 'Save Recipe'}
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