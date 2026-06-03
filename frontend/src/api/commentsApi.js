import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';

// Path helpers
const commentsCol = (recipeKey) =>
  collection(db, 'recipeComments', recipeKey, 'comments');

const repliesCol = (recipeKey, commentId) =>
  collection(db, 'recipeComments', recipeKey, 'comments', commentId, 'replies');

const commentDoc = (recipeKey, commentId) =>
  doc(db, 'recipeComments', recipeKey, 'comments', commentId);

const replyDoc = (recipeKey, commentId, replyId) =>
  doc(db, 'recipeComments', recipeKey, 'comments', commentId, 'replies', replyId);

// ─── Comments ────────────────────────────────────────────────────────────────

export async function getComments(recipeKey) {
  const q = query(commentsCol(recipeKey), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addComment(recipeKey, { userId, userEmail, text, rating }) {
  return addDoc(commentsCol(recipeKey), {
    userId,
    userEmail,
    text,
    rating,
    upvotedBy: [],
    timestamp: serverTimestamp(),
  });
}

// Toggle upvote on a comment (add if not already upvoted, remove if already upvoted)
export async function toggleCommentUpvote(recipeKey, commentId, userId) {
  const ref = commentDoc(recipeKey, commentId);
  const snap = await getDocs(commentsCol(recipeKey));
  const existing = snap.docs.find((d) => d.id === commentId);
  const upvotedBy = existing?.data().upvotedBy ?? [];
  const alreadyUpvoted = upvotedBy.includes(userId);

  return updateDoc(ref, {
    upvotedBy: alreadyUpvoted ? arrayRemove(userId) : arrayUnion(userId),
  });
}

// ─── Replies ─────────────────────────────────────────────────────────────────

// Returns replies for a comment, sorted by upvote count descending
export async function getReplies(recipeKey, commentId) {
  const q = query(repliesCol(recipeKey, commentId), orderBy('timestamp', 'asc'));
  const snap = await getDocs(q);
  const replies = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  // Sort by upvote count descending (as required)
  return replies.sort((a, b) => (b.upvotedBy?.length ?? 0) - (a.upvotedBy?.length ?? 0));
}

export async function addReply(recipeKey, commentId, { userId, userEmail, text }) {
  return addDoc(repliesCol(recipeKey, commentId), {
    userId,
    userEmail,
    text,
    upvotedBy: [],
    timestamp: serverTimestamp(),
  });
}

// Toggle upvote on a reply
export async function toggleReplyUpvote(recipeKey, commentId, replyId, userId) {
  const ref = replyDoc(recipeKey, commentId, replyId);
  const snap = await getDocs(repliesCol(recipeKey, commentId));
  const existing = snap.docs.find((d) => d.id === replyId);
  const upvotedBy = existing?.data().upvotedBy ?? [];
  const alreadyUpvoted = upvotedBy.includes(userId);

  return updateDoc(ref, {
    upvotedBy: alreadyUpvoted ? arrayRemove(userId) : arrayUnion(userId),
  });
}
