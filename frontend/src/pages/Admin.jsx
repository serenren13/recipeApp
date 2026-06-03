import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export default function Admin() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailRecipe, setDetailRecipe] = useState(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const q = query(collection(db, 'recipes'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRecipes(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (id) => {
    await updateDoc(doc(db, 'recipes', id), { status: 'published' });
  };

  const handleReject = async (id) => {
    await updateDoc(doc(db, 'recipes', id), { status: 'rejected' });
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    const results = term
      ? recipes.filter(
          (r) =>
            r.title?.toLowerCase().includes(term) ||
            r.authorName?.toLowerCase().includes(term)
        )
      : recipes;

    return [...results].sort((a, b) => {
      const aTime = a.createdAt?.seconds ?? 0;
      const bTime = b.createdAt?.seconds ?? 0;
      return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });
  }, [recipes, search, sortOrder]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#06202B' }}>

      <Box sx={{ maxWidth: 800, mx: 'auto', px: 3, pt: 4, pb: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography sx={{ color: '#fdeb9e' }} fontWeight={600}>
                Welcome back, Admin!
            </Typography>

            <Typography sx={{ color: '#fdeb9e' }} variant="h4" fontWeight={700}>
                <strong>Recipe Review</strong>
            </Typography>
        </Box>

        {/* Search + Sort */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', mt: 4 }}>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or username…"
            size="small"
            sx={{
                flexGrow: 1,
                bgcolor: '#ffffff',
                borderRadius: 1,
                '& input': { color: '#000 !important' },
                '& .MuiOutlinedInput-root fieldset': {
                    borderColor: '#7AE2CF',
                },
            }}
            slotProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#077A7D' }} />
                </InputAdornment>
              ),
            }}
          />

          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            size="small"
            sx={{
                bgcolor: '#ffffff',
                minWidth: 140,
                color: '#06202B !important',
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#7AE2CF',
                },
                '& .MuiSelect-select': { color: '#06202B !important' },
            }}
          >
            <MenuItem value="newest">Most recent</MenuItem>
            <MenuItem value="oldest">Oldest first</MenuItem>
          </Select>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress sx={{ color: '#7AE2CF' }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Typography sx={{ color: '#7AE2CF', mt: 4 }}>
            {search
              ? `No recipes matching "${search}".`
              : 'No recipes pending review.'}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.map((recipe) => (
              <RecipeReviewCard
                key={recipe.id}
                recipe={recipe}
                onApprove={() => handleApprove(recipe.id)}
                onReject={() => handleReject(recipe.id)}
                onViewDetails={() => setDetailRecipe(recipe)}
              />
            ))}
          </Box>
        )}
      </Box>

      <RecipeDetailModal
        recipe={detailRecipe}
        onClose={() => setDetailRecipe(null)}
        onApprove={() => {
          handleApprove(detailRecipe.id);
          setDetailRecipe(null);
        }}
        onReject={() => {
          handleReject(detailRecipe.id);
          setDetailRecipe(null);
        }}
      />
    </Box>
  );
}

/* ---------------- CARD ---------------- */

function RecipeReviewCard({ recipe, onApprove, onReject, onViewDetails }) {
  const date = recipe.createdAt?.seconds
    ? new Date(recipe.createdAt.seconds * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <Card
      sx={{
        bgcolor: '#ffffff',
        border: '1px solid #7AE2CF',
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography fontWeight={700} sx={{ color: '#06202B' }}>
              {recipe.title}
            </Typography>

            {date && (
              <Typography variant="caption" sx={{ color: '#077A7D' }}>
                {date}
              </Typography>
            )}
          </Box>

          <Typography sx={{ color: '#077A7D', fontStyle: 'italic' }}>
            {recipe.authorName || 'Unknown user'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            onClick={onViewDetails}
            sx={{
              bgcolor: '#7AE2CF',
              color: '#06202B',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#077A7D',
                color: '#ffffff',
              },
            }}
          >
            Details
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            onClick={onReject}
            variant="outlined"
            sx={{
              borderColor: '#06202B',
              color: '#06202B',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'rgba(6,32,43,0.1)',
              },
            }}
          >
            Reject
          </Button>

          <Button
            onClick={onApprove}
            sx={{
              bgcolor: '#077A7D',
              color: '#fff',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#06202B',
              },
            }}
          >
            Approve
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

/* ---------------- MODAL ---------------- */

function RecipeDetailModal({ recipe, onClose, onApprove, onReject }) {
  if (!recipe) return null;

  return (
    <Dialog open={!!recipe} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          bgcolor: '#06202B',
          color: '#FDEB9E',
          fontWeight: 700,
        }}
      >
        {recipe.title}

        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon sx={{ color: '#FDEB9E' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: '#ffffff' }}>
        <Typography sx={{ color: '#077A7D', mt: 2 }}>
          Submitted by <strong>{recipe.authorName || 'Unknown'}</strong>
        </Typography>

        <Divider sx={{ my: 2, borderColor: '#7AE2CF' }} />

        <Typography fontWeight={700} sx={{ color: '#06202B' }}>
          Ingredients
        </Typography>
        <Typography sx={{ color: '#077A7D', mb: 2 }}>
          {recipe.ingredients || '—'}
        </Typography>

        <Typography fontWeight={700} sx={{ color: '#06202B' }}>
          Instructions
        </Typography>
        <Typography sx={{ color: '#077A7D', mb: 3 }}>
          {recipe.instructions || '—'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            onClick={onReject}
            variant="outlined"
            sx={{
              borderColor: '#06202B',
              color: '#06202B',
            }}
          >
            Reject
          </Button>

          <Button
            onClick={onApprove}
            sx={{
              bgcolor: '#077A7D',
              color: '#fff',
              '&:hover': {
                bgcolor: '#06202B',
              },
            }}
          >
            Approve
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}