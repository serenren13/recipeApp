import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function CreateRecipe() {
  const [form, setForm] = useState({ title: '', ingredients: '', instructions: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.ingredients.trim() || !form.instructions.trim()) {
      setError('Please fill in all fields before submitting.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const user = auth.currentUser;

      await addDoc(collection(db, 'recipes'), {
        title: form.title.trim(),
        ingredients: form.ingredients.trim(),
        instructions: form.instructions.trim(),
        authorId: user?.uid || 'anonymous',
        authorName: user?.displayName || user?.email || 'Anonymous',
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setForm({ title: '', ingredients: '', instructions: '' });

    } catch (err) {
      console.error(err);
      setError('Failed to submit recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NEW: Clear form
  const handleClear = () => {
    setForm({ title: '', ingredients: '', instructions: '' });
    setError('');
    setSuccess(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#095154' }}>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          pt: 6,
          pb: 8,
          px: 2,
        }}
      >
        <Card
          variant="outlined"
          sx={{
            width: '100%',
            maxWidth: 620,
            borderRadius: 2,
            border: '1.5px solid #ccc',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
              <b>Create New Recipe</b>
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Recipe submitted for review!
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Title */}
            <Typography variant="body2" fontWeight={600} mb={0.75}>
              Recipe Title
            </Typography>
            <TextField
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="e.g. Classic Spaghetti Carbonara"
              sx={{
                mb: 3,
                bgcolor: '#f0f0f0',
                borderRadius: 1,
                '& input': { color: '#06202B !important' },
                '& textarea': { color: '#06202B!important' },
              }}
            />

            {/* Ingredients */}
            <Typography variant="body2" fontWeight={600} mb={0.75}>
              Ingredients
            </Typography>
            <TextField
              name="ingredients"
              value={form.ingredients}
              onChange={handleChange}
              fullWidth
              multiline
              rows={5}
              placeholder={"e.g.\n200g spaghetti\n2 eggs\n100g pancetta\n50g parmesan"}
              sx={{
                mb: 3,
                bgcolor: '#f0f0f0',
                borderRadius: 1,
                '& input': { color: '#06202B !important' },
                '& textarea': { color: '#06202B!important' },
              }}
            />

            {/* Instructions */}
            <Typography variant="body2" fontWeight={600} mb={0.75}>
              Body (instructions)
            </Typography>
            <TextField
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              fullWidth
              multiline
              rows={6}
              placeholder="Describe the steps to make this recipe..."
              sx={{
                mb: 3,
                bgcolor: '#f0f0f0',
                borderRadius: 1,
                '& input': { color: '#06202B !important' },
                '& textarea': { color: '#06202B!important' },
              }}
            />

            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              
              {/* CLEAR BUTTON */}
              <Button
                onClick={handleClear}
                variant="outlined"
                sx={{
                  borderColor: '#7AE2CF',
                  color: '#7AE2CF',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 3,
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#FDEB9E',
                    color: '#FDEB9E',
                  },
                }}
              >
                Clear
              </Button>

              {/* SUBMIT BUTTON */}
              <Button
                onClick={handleSubmit}
                disabled={loading}
                variant="contained"
                sx={{
                  bgcolor: '#077A7D',
                  color: '#fdeb9e',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  '&:hover': { bgcolor: '#157a6e' },
                  '&:disabled': { bgcolor: '#aaa' },
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Submit for review'}
              </Button>
            </Box>

          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}