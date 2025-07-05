const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');

// Create a new application
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const candidateId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ status: 'fail', message: 'Job not found' });
    }

    const existingApp = await Application.findOne({ jobId, candidateId });
    if (existingApp) {
      return res.status(400).json({ status: 'fail', message: 'You already applied for this job' });
    }

    const resumeFile = req.files?.resume?.[0];
    const coverLetterFile = req.files?.coverLetter?.[0];

    if (!resumeFile) {
      return res.status(400).json({ status: 'fail', message: 'Resume is required as file' });
    }

    const application = new Application({
      jobId,
      candidateId,
      resume: resumeFile.path,
      coverLetter: coverLetterFile ? coverLetterFile.path : undefined
    });

    const savedApp = await application.save();
    res.status(201).json({ status: 'success', data: savedApp });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Get applications by the logged-in candidate
const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ candidateId: req.user._id }).populate('jobId');
    res.status(200).json({ status: 'success', data: apps });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Get applications by candidate ID (admin or self)
const getByCandidate = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.candidateId) {
      return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
    }

    const apps = await Application.find({ candidateId: req.params.candidateId }).populate('jobId');
    res.status(200).json({ status: 'success', data: apps });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Get applications by job ID (admin or employer)
const getByJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ status: 'fail', message: 'Job not found' });
    }

    const isOwner = job.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ status: 'fail', message: 'Not authorized to view applications for this job' });
    }

    const apps = await Application.find({ jobId: job._id }).populate('candidateId');
    res.status(200).json({ status: 'success', data: apps });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Candidate or Admin updates resume or coverLetter
const updateApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ status: 'fail', message: 'Application not found' });

    if (req.user.role !== 'admin' && app.candidateId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
    }

    const resumeFile = req.files?.resume?.[0];
    const coverLetterFile = req.files?.coverLetter?.[0];

    if (resumeFile) app.resume = resumeFile.path;
    if (coverLetterFile) app.coverLetter = coverLetterFile.path;

    await app.save();
    res.status(200).json({ status: 'success', data: app });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Update application status (admin or employer)
const updateApplicationStatus = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ status: 'fail', message: 'Application not found' });

    const job = await Job.findById(app.jobId);
    const isOwner = job?.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ status: 'fail', message: 'Unauthorized to update status' });
    }

    const validStatuses = ['applied', 'under_review', 'interviewed', 'hired', 'rejected'];
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid application status' });
    }
    
    app.status = req.body.status;
    await app.save();

    res.status(200).json({ status: 'success', data: app });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Delete application (admin or owner)
const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ status: 'fail', message: 'Application not found' });

    if (req.user.role !== 'admin' && app.candidateId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
    }

    await app.deleteOne();
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getByCandidate,
  getByJob,
  updateApplication,
  updateApplicationStatus,
  deleteApplication
};