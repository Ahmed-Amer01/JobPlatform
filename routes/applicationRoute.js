const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');
const upload = require('../middlewares/upload');
const applicationController = require('../controllers/applicationController');

const router = express.Router();

router.use(verifyToken);

// Candidate or Admin: Apply for job
router.post('/', allowedTo('candidate', 'admin'), upload, applicationController.applyForJob);

// Candidate or Admin: View my applications
router.get('/my-applications', allowedTo('candidate', 'admin'), applicationController.getMyApplications);

// Admin or Employer: View applications by job ID
router.get('/job/:jobId', allowedTo('admin', 'employer'), applicationController.getByJob);

// Admin or Candidate: View applications by candidate ID
router.get('/candidate/:candidateId', allowedTo('admin', 'candidate'), applicationController.getByCandidate);

// Admin or Candidate: Edit application (cover letter or resume)
router.patch('/:id', allowedTo('admin', 'candidate'), upload, applicationController.updateApplication);

// Admin or Employer: Update application status
router.patch('/:id/status', allowedTo('admin', 'employer'), applicationController.updateApplicationStatus);

// Admin or Candidate: Delete application
router.delete('/:id', allowedTo('admin', 'candidate'), applicationController.deleteApplication);

module.exports = router;
