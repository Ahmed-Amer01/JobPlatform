const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');
const upload = require('../middlewares/upload');
const userController = require('../controllers/userController');


const router = express.Router();
router.use(verifyToken , allowedTo('candidate', 'employer', 'admin'));
router.get('/:id', userController.getUserById); // Add this line

router.get('/profile', userController.getCurrentUser);
router.patch('/profile', upload, userController.updateUser);
router.delete('/profile', userController.deleteUser);

module.exports = router;