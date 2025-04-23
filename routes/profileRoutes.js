const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/profileController');

// Route to get user profile by Firebase UID
router.get('/:firebaseUID', getUserProfile);

module.exports = router;
