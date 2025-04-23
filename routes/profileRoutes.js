const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/profileController');

router.get('/:firebaseUID', getUserProfile);

module.exports = router;
