const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');
const upload = require('../middlewares/upload');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.use(verifyToken, allowedTo('admin'));

router.get('/', adminController.getAllUsers);
router.get('/admins', adminController.getAllAdmins);
router.get('/:id', adminController.getUserById);
router.post('/', upload, adminController.createAdmin);
router.patch('/:id', upload, adminController.updateAdminOrUser);
router.delete('/:id', adminController.deleteAdminOrUser);

module.exports = router;