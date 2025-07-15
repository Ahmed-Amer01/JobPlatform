const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');
const jobController = require('../controllers/jobController');

const router = express.Router();

router.get('/', jobController.getAllJobs);

router.get('/:id/applications', verifyToken, jobController.getJobApplications);

router.get('/:id', jobController.getJobById);

router.use(verifyToken, allowedTo('admin', 'user'));

router.post('/', jobController.createJob);
router.patch('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

module.exports = router;