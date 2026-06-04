const express = require('express');
const router = express.Router();
const controller = require('../controllers/aiController');

// POST /api/ai/chat
router.post('/chat', controller.chat);

module.exports = router;
