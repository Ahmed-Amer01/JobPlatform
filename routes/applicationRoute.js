const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');
const upload = require('../middlewares/upload');
const applicationController = require('../controllers/applicationController');

const router = express.Router();

router.use(verifyToken);

// Candidate or Admin: Apply for job
router.post('/', upload, applicationController.applyForJob);

// Candidate or Admin: View my applications
router.get('/my-applications', applicationController.getMyApplications);

// Admin or Employer: View applications by job ID
router.get('/job/:jobId', applicationController.getByJob);

// Admin or Candidate: View applications by candidate ID
router.get('/candidate/:candidateId', applicationController.getByCandidate);

// Admin or Candidate: Edit application (cover letter or resume)
router.patch('/:id', upload, applicationController.updateApplication);

// Admin or Employer: Update application status
router.patch('/:id/status', applicationController.updateApplicationStatus);

// Admin or Candidate: Delete application
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;
