import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  Collapse,
  CircularProgress,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

async function sendMessage(messages, recipe) {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, recipe }),
  });
  if (!res.ok) throw new Error('Failed to get AI response');
  const data = await res.json();
  return data.reply;
}

export default function RecipeChat({ recipe }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your cooking assistant for **${recipe.title}**. Ask me anything — ingredient swaps, scaling, techniques, or tips!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Scroll to latest message whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessage(
        updatedMessages.filter((m) => m.role !== 'assistant' || updatedMessages.indexOf(m) > 0),
        recipe
      );
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating chat panel */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 100,
          right: 32,
          width: { xs: 'calc(100vw - 48px)', sm: 360 },
          zIndex: 1300,
          display: open ? 'flex' : 'none',
          flexDirection: 'column',
        }}
      >
        <Paper
          elevation={8}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 460,
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1.5px solid #077A7D',
            backgroundColor: '#06202B',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              backgroundColor: '#077A7D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon sx={{ color: '#FDEB9E', fontSize: 20 }} />
              <Box>
                <Typography variant="body2" fontWeight={700} sx={{ color: '#FDEB9E', lineHeight: 1.2 }}>
                  Recipe Assistant
                </Typography>
                <Typography variant="caption" sx={{ color: '#7AE2CF', opacity: 0.85 }}>
                  {recipe.title}
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#FDEB9E' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 2,
              py: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#077A7D', borderRadius: '4px' },
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '80%',
                    px: 1.5,
                    py: 1,
                    borderRadius:
                      msg.role === 'user'
                        ? '12px 12px 2px 12px'
                        : '12px 12px 12px 2px',
                    backgroundColor: msg.role === 'user' ? '#077A7D' : 'rgba(7,122,125,0.15)',
                    border: msg.role === 'user' ? 'none' : '1px solid rgba(7,122,125,0.4)',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#FDEB9E',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                  </Typography>
                </Box>
              </Box>
            ))}

            {/* Typing indicator */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Box
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: '12px 12px 12px 2px',
                    backgroundColor: 'rgba(7,122,125,0.15)',
                    border: '1px solid rgba(7,122,125,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  {[0, 1, 2].map((dot) => (
                    <Box
                      key={dot}
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#7AE2CF',
                        animation: 'bounce 1.2s infinite',
                        animationDelay: `${dot * 0.2}s`,
                        '@keyframes bounce': {
                          '0%, 80%, 100%': { transform: 'scale(0.7)', opacity: 0.5 },
                          '40%': { transform: 'scale(1)', opacity: 1 },
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <div ref={bottomRef} />
          </Box>

          {/* Input */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderTop: '1px solid rgba(7,122,125,0.4)',
              display: 'flex',
              gap: 1,
              flexShrink: 0,
            }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder="Ask about this recipe..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#FDEB9E',
                  '& fieldset': { borderColor: '#077A7D' },
                  '&:hover fieldset': { borderColor: '#7AE2CF' },
                  '&.Mui-focused fieldset': { borderColor: '#7AE2CF' },
                },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={loading || !input.trim()}
              sx={{
                backgroundColor: '#077A7D',
                color: '#FDEB9E',
                '&:hover': { backgroundColor: '#7AE2CF', color: '#06202B' },
                '&.Mui-disabled': { backgroundColor: 'rgba(7,122,125,0.3)', color: 'rgba(253,235,158,0.3)' },
              }}
            >
              {loading ? <CircularProgress size={18} sx={{ color: '#FDEB9E' }} /> : <SendIcon fontSize="small" />}
            </IconButton>
          </Box>
        </Paper>
      </Box>

      {/* FAB */}
      <Fab
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          backgroundColor: '#077A7D',
          color: '#FDEB9E',
          '&:hover': { backgroundColor: '#7AE2CF', color: '#06202B' },
          zIndex: 1300,
        }}
      >
        {open ? <CloseIcon /> : <SmartToyIcon />}
      </Fab>
    </>
  );
}
