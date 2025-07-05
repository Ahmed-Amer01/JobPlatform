const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const allowTo = require('../middlewares/allowedTo');
const upload = require('../middlewares/upload');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.use(verifyToken, allowedTo('admin'));

router.get('/', adminController.getAllUsers);
router.get('/admins', adminController.getAllAdmins);
router.get('/candidates', adminController.getAllCandidates);
router.get('/employers', adminController.getAllEmployers);
router.get('/:id', adminController.getUserById);
router.post('/', upload, adminController.createAdmin);
router.patch('/:id', upload, adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;