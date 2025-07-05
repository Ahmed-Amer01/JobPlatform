const express = require('express');
const router = express.Router();
const controller = require('../controllers/application.controller');

router.post('/', controller.createApplication);
router.get('/candidate/:candidateId', controller.getByCandidate);
router.get('/job/:jobId', controller.getByJob);
router.put('/:id/status', controller.updateStatus);

module.exports = router;
