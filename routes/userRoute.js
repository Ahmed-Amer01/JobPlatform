const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const allowTo = require('../middlewares/allowedTo');
const upload = require('../middlewares/upload');
const userController = require('../controllers/userController');
const allowedTo = require('../middlewares/allowedTo');


const router = express.Router();
router.use(verifyToken , allowedTo('candidate', 'employer', 'admin'));

router.get('/profile', userController.getCurrentUser);
router.patch('/profile', upload, userController.updateUser);
router.delete('/profile', userController.deleteUser);

module.exports = router;