const express = require('express');
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken')
const allowedTo = require('../middlewares/allowedTo')
const upload = require('../middlewares/upload')

const router = express.Router();

router.post('/register', upload, authController.register);
router.post('/login', authController.login);
router.post('/logout', verifyToken,allowedTo('admin', 'candidate', 'employer'), authController.logout);

module.exports = router;