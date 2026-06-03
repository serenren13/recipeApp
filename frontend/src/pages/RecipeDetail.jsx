import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Divider,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { getOfficialRecipeById } from '../api/recipeApi';
import CommentsSection from '../components/CommentsSection';
import RecipeChat from '../components/RecipeChat';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getOfficialRecipeById(id)
      .then(setRecipe)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

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

  const totalMinutes = (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);

  const difficultyColor =
    recipe.difficulty === 'Easy'
      ? '#7AE2CF'
      : recipe.difficulty === 'Medium'
      ? '#FDEB9E'
      : '#e57373';

  return (
    <Box sx={{ backgroundColor: '#06202B', minHeight: '100vh', pb: 8 }}>

      {/* Back button */}
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
            transition: 'color 0.2s',
          }}
        >
          <ArrowBackIcon fontSize="small" />
          <Typography variant="body2" fontWeight={600}>Back</Typography>
        </Box>
      </Box>

      {/* Hero image */}
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
            display: 'block',
          }}
        />
      </Box>

      {/* Title + tags */}
      <Box sx={{ px: { xs: 2, md: 6 }, mt: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: '#FDEB9E' }}>
          {recipe.title}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
          {recipe.cuisine && (
            <Chip label={recipe.cuisine} size="small" sx={{ backgroundColor: '#077A7D', color: '#FDEB9E' }} />
          )}
          {recipe.tags?.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ borderColor: '#077A7D', color: '#7AE2CF' }} />
          ))}
          {recipe.mealType?.map((mt) => (
            <Chip key={mt} label={mt} size="small" sx={{ backgroundColor: '#06202B', border: '1px solid #7AE2CF', color: '#7AE2CF' }} />
          ))}
        </Box>
      </Box>

      {/* Stats strip */}
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          mt: 3,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          alignItems: 'center',
        }}
      >
        <StatItem icon={<AccessTimeIcon sx={{ fontSize: 18, color: '#7AE2CF' }} />} label="Total Time" value={`${totalMinutes} min`} />
        <StatItem icon={<AccessTimeIcon sx={{ fontSize: 18, color: '#7AE2CF' }} />} label="Prep" value={`${recipe.prepTimeMinutes} min`} />
        <StatItem icon={<AccessTimeIcon sx={{ fontSize: 18, color: '#7AE2CF' }} />} label="Cook" value={`${recipe.cookTimeMinutes} min`} />
        <StatItem icon={<PeopleIcon sx={{ fontSize: 18, color: '#7AE2CF' }} />} label="Servings" value={recipe.servings} />
        <StatItem icon={<LocalFireDepartmentIcon sx={{ fontSize: 18, color: '#7AE2CF' }} />} label="Calories" value={`${recipe.caloriesPerServing} kcal`} />
        <StatItem icon={<StarIcon sx={{ fontSize: 18, color: '#FDEB9E' }} />} label="Rating" value={`${recipe.rating} (${recipe.reviewCount})`} />
        <Box>
          <Typography variant="caption" sx={{ color: '#7AE2CF', display: 'block' }}>Difficulty</Typography>
          <Typography variant="body2" fontWeight={700} sx={{ color: difficultyColor }}>
            {recipe.difficulty}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: { xs: 2, md: 6 }, mt: 3, borderColor: '#077A7D' }} />

      {/* Ingredients + Instructions */}
      <Grid container spacing={3} sx={{ px: { xs: 2, md: 6 }, mt: 0.5 }}>

        {/* Ingredients */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#FDEB9E', mb: 1.5 }}>
            Ingredients
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {recipe.ingredients?.map((ing, i) => (
              <Box
                component="li"
                key={i}
                sx={{
                  color: '#7AE2CF',
                  mb: 0.75,
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                }}
              >
                {ing}
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Instructions */}
        <Grid item xs={12} md={9}>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#FDEB9E', mb: 1.5 }}>
            Instructions
          </Typography>
          <Box
            sx={{
              border: '1.5px solid #077A7D',
              borderRadius: '12px',
              p: { xs: 2, md: 3 },
              backgroundColor: 'rgba(7, 122, 125, 0.07)',
            }}
          >
            {recipe.instructions?.map((step, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: '#077A7D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" fontWeight={700} sx={{ color: '#FDEB9E' }}>
                    {i + 1}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#FDEB9E', lineHeight: 1.7, pt: 0.3 }}>
                  {step}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Comments */}
      <Box sx={{ px: { xs: 2, md: 6 }, mt: 5 }}>
        <Divider sx={{ borderColor: '#077A7D', mb: 4 }} />
        <CommentsSection recipeKey={`official_${id}`} />
      </Box>

      <RecipeChat recipe={recipe} />

    </Box>
  );
}

function StatItem({ icon, label, value }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {icon}
        <Typography variant="caption" sx={{ color: '#7AE2CF' }}>{label}</Typography>
      </Box>
      <Typography variant="body2" fontWeight={600} sx={{ color: '#FDEB9E' }}>
        {value}
      </Typography>
    </Box>
  );
}
