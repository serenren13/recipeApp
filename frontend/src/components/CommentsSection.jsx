import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Rating,
  Divider,
  CircularProgress,
  IconButton,
  Collapse,
  Chip,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReplyIcon from '@mui/icons-material/Reply';
import { useAuth } from '../context/AuthContext';
import {
  getComments,
  addComment,
  toggleCommentUpvote,
  getReplies,
  addReply,
  toggleReplyUpvote,
} from '../api/commentsApi';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function userLabel(email) {
  return email ? email.split('@')[0] : 'User';
}

function initials(email) {
  const label = userLabel(email);
  return label.slice(0, 2).toUpperCase();
}


function ReplyItem({ reply, recipeKey, commentId, currentUser, onUpvote }) {
  const hasUpvoted = currentUser && reply.upvotedBy?.includes(currentUser.uid);
  const upvoteCount = reply.upvotedBy?.length ?? 0;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        py: 1.5,
        pl: 2,
        borderLeft: '2px solid #077A7D',
        ml: 1,
      }}
    >
      <Avatar sx={{ width: 28, height: 28, fontSize: '0.65rem', bgcolor: '#077A7D', color: '#FDEB9E' }}>
        {initials(reply.userEmail)}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="caption" fontWeight={600} sx={{ color: '#7AE2CF' }}>
            {userLabel(reply.userEmail)}
          </Typography>
          <Typography variant="caption" sx={{ color: '#7AE2CF', opacity: 0.5 }}>
            {formatDate(reply.timestamp)}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#FDEB9E', lineHeight: 1.6 }}>
          {reply.text}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <IconButton
            size="small"
            disabled={!currentUser}
            onClick={() => onUpvote(reply.id)}
            sx={{ color: hasUpvoted ? '#077A7D' : '#7AE2CF', p: 0.5 }}
          >
            <ThumbUpIcon sx={{ fontSize: 14 }} />
          </IconButton>
          <Typography variant="caption" sx={{ color: '#7AE2CF' }}>{upvoteCount}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

// Comment Item

function CommentItem({ comment, recipeKey, currentUser, onCommentUpvote }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const hasUpvoted = currentUser && comment.upvotedBy?.includes(currentUser.uid);
  const upvoteCount = comment.upvotedBy?.length ?? 0;

  const loadReplies = async () => {
    setLoadingReplies(true);
    const data = await getReplies(recipeKey, comment.id);
    setReplies(data);
    setLoadingReplies(false);
  };

  const handleToggleReplies = () => {
    if (!showReplies && replies.length === 0) loadReplies();
    setShowReplies((prev) => !prev);
  };

  const handleAddReply = async () => {
    if (!replyText.trim() || !currentUser) return;
    setSubmittingReply(true);
    await addReply(recipeKey, comment.id, {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      text: replyText.trim(),
    });
    const updated = await getReplies(recipeKey, comment.id);
    setReplies(updated);
    setReplyText('');
    setShowReplyInput(false);
    setShowReplies(true);
    setSubmittingReply(false);
  };

  const handleUpvoteReply = async (replyId) => {
    if (!currentUser) return;
    await toggleReplyUpvote(recipeKey, comment.id, replyId, currentUser.uid);
    const updated = await getReplies(recipeKey, comment.id);
    setReplies(updated);
  };

  return (
    <Box
      sx={{
        border: '1px solid #077A7D',
        borderRadius: '10px',
        p: 2,
        mb: 2,
        backgroundColor: 'rgba(7,122,125,0.05)',
      }}
    >
      {/* Comment header */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
        <Avatar sx={{ width: 36, height: 36, fontSize: '0.75rem', bgcolor: '#077A7D', color: '#FDEB9E' }}>
          {initials(comment.userEmail)}
        </Avatar>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" fontWeight={600} sx={{ color: '#7AE2CF' }}>
              {userLabel(comment.userEmail)}
            </Typography>
            <Typography variant="caption" sx={{ color: '#7AE2CF', opacity: 0.5 }}>
              {formatDate(comment.timestamp)}
            </Typography>
          </Box>
          {comment.rating > 0 && (
            <Rating value={comment.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#FDEB9E' } }} />
          )}
        </Box>
      </Box>

      {/* Comment text */}
      <Typography variant="body2" sx={{ color: '#FDEB9E', lineHeight: 1.7, mb: 1.5 }}>
        {comment.text}
      </Typography>

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            disabled={!currentUser}
            onClick={() => onCommentUpvote(comment.id)}
            sx={{ color: hasUpvoted ? '#077A7D' : '#7AE2CF', p: 0.5 }}
          >
            <ThumbUpIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Typography variant="caption" sx={{ color: '#7AE2CF' }}>{upvoteCount}</Typography>
        </Box>

        <Button
          size="small"
          startIcon={<ReplyIcon sx={{ fontSize: 14 }} />}
          onClick={() => setShowReplyInput((prev) => !prev)}
          disabled={!currentUser}
          sx={{ color: '#7AE2CF', fontSize: '0.75rem', px: 1.5, py: 0.5, minWidth: 0, textTransform: 'none', borderRadius: '6px' }}
        >
          Reply
        </Button>

        {replies.length > 0 || showReplies ? (
          <Button
            size="small"
            onClick={handleToggleReplies}
            sx={{ color: '#7AE2CF', fontSize: '0.75rem', px: 1.5, py: 0.5, minWidth: 0, textTransform: 'none', borderRadius: '6px' }}
          >
            {showReplies ? 'Hide replies' : `${replies.length} repl${replies.length === 1 ? 'y' : 'ies'}`}
          </Button>
        ) : (
          <Button
            size="small"
            onClick={handleToggleReplies}
            sx={{ color: '#7AE2CF', fontSize: '0.75rem', px: 1.5, py: 0.5, minWidth: 0, textTransform: 'none', borderRadius: '6px' }}
          >
            View replies
          </Button>
        )}
      </Box>

      {/* Reply input */}
      <Collapse in={showReplyInput}>
        <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddReply()}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#FDEB9E',
                '& fieldset': { borderColor: '#077A7D' },
                '&:hover fieldset': { borderColor: '#7AE2CF' },
                '&.Mui-focused fieldset': { borderColor: '#7AE2CF' },
              },
            }}
          />
          <Button
            onClick={handleAddReply}
            disabled={submittingReply || !replyText.trim()}
            sx={{ bgcolor: '#077A7D', color: '#FDEB9E', '&:hover': { bgcolor: '#7AE2CF', color: '#06202B' }, whiteSpace: 'nowrap' }}
          >
            {submittingReply ? '...' : 'Post'}
          </Button>
        </Box>
      </Collapse>

      {/* Replies list */}
      <Collapse in={showReplies}>
        <Box sx={{ mt: 1.5 }}>
          {loadingReplies ? (
            <CircularProgress size={16} sx={{ color: '#077A7D', ml: 1 }} />
          ) : (
            replies.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                recipeKey={recipeKey}
                commentId={comment.id}
                currentUser={currentUser}
                onUpvote={handleUpvoteReply}
              />
            ))
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function CommentsSection({ recipeKey }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    const data = await getComments(recipeKey);
    setComments(data);
  };

  useEffect(() => {
    loadComments().finally(() => setLoading(false));
  }, [recipeKey]);

  const handleSubmit = async () => {
  if (!newText.trim() || !newRating || !user) return;

  try {
    setSubmitting(true);

    console.log('Posting comment...');

    await addComment(recipeKey, {
      userId: user.uid,
      userEmail: user.email,
      text: newText.trim(),
      rating: newRating,
    });

    console.log('Comment added successfully');

    await loadComments();

    setNewText('');
    setNewRating(0);
  } catch (error) {
    console.error('Comment error:', error);
    alert(error.message);
  } finally {
    setSubmitting(false);
  }
};

  const handleCommentUpvote = async (commentId) => {
    if (!user) return;
    await toggleCommentUpvote(recipeKey, commentId, user.uid);
    await loadComments();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ color: '#FDEB9E', mb: 3 }}>
        Comments
      </Typography>

      {/* New comment form */}
      {user ? (
        <Box
          sx={{
            border: '1px solid #077A7D',
            borderRadius: '10px',
            p: 2.5,
            mb: 4,
            backgroundColor: 'rgba(7,122,125,0.05)',
          }}
        >
          <Typography variant="body2" sx={{ color: '#7AE2CF', mb: 1 }}>
            Your rating
          </Typography>
          <Rating
            value={newRating}
            onChange={(_, val) => setNewRating(val)}
            sx={{ mb: 2, '& .MuiRating-iconFilled': { color: '#FDEB9E' }, '& .MuiRating-iconEmpty': { color: '#077A7D' } }}
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="Share your thoughts about this recipe..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#FDEB9E',
                '& fieldset': { borderColor: '#077A7D' },
                '&:hover fieldset': { borderColor: '#7AE2CF' },
                '&.Mui-focused fieldset': { borderColor: '#7AE2CF' },
              },
            }}
          />
          <Button
            onClick={handleSubmit}
            disabled={submitting || !newText.trim() || !newRating}
            sx={{
              bgcolor: '#077A7D',
              color: '#FDEB9E',
              '&:hover': { bgcolor: '#7AE2CF', color: '#06202B' },
              '&.Mui-disabled': { bgcolor: 'rgba(7,122,125,0.3)', color: 'rgba(253,235,158,0.4)' },
            }}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            border: '1px dashed #077A7D',
            borderRadius: '10px',
            p: 3,
            mb: 4,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ color: '#7AE2CF' }}>
            <Box component="span" sx={{ color: '#FDEB9E', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => window.location.href = '/signin'}
            >
              Sign in
            </Box>{' '}
            to leave a comment or rating.
          </Typography>
        </Box>
      )}

      {/* Comments list */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#077A7D' }} />
        </Box>
      ) : comments.length === 0 ? (
        <Typography sx={{ color: '#7AE2CF', textAlign: 'center', py: 4 }}>
          No comments yet. Be the first to review this recipe!
        </Typography>
      ) : (
        <Box>
          <Typography variant="body2" sx={{ color: '#7AE2CF', mb: 2 }}>
            {comments.length} comment{comments.length !== 1 ? 's' : ''}
          </Typography>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              recipeKey={recipeKey}
              currentUser={user}
              onCommentUpvote={handleCommentUpvote}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
