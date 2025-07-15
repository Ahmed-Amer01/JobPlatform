const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');
const jobController = require('../controllers/jobController');

const router = express.Router();

router.get('/my-jobs', verifyToken, allowedTo('user', 'admin'), jobController.getMyJobs);

router.get('/search', jobController.searchJobs);

router.get('/:id/applications', verifyToken, jobController.getJobApplications);

router.get('/:id', jobController.getJobById);

router.get('/', jobController.getAllJobs);

router.use(verifyToken, allowedTo('admin', 'user'));

router.post('/', jobController.createJob);
router.patch('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

module.exports = router;