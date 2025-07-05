const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', allowedTo('admin', 'candidate', 'employer'), authController.logout);

module.exports = router;