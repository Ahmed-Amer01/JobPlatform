const Application = require('../models/applicationModel');
const Job = require('../models/jobModel');

const VALID_STATUSES = ['applied', 'under_review', 'interviewed', 'hired', 'rejected'];

// Create a new application
const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const candidateId = req.user._id;

        const job = await Job.findById(jobId);
    if (!job || !job.postedBy) {
            return res.status(404).json({ status: 'fail', message: 'Job not found' });
        }

        if (!job.isActive) {
            return res.status(400).json({ status: 'fail', message: 'This job is no longer active' });
        }

        if (job.postedBy.toString() === candidateId.toString()) {
            return res.status(400).json({ status: 'fail', message: 'You cannot apply to your own job' });
        }

        const existingApp = await Application.findOne({ jobId, candidateId });
        if (existingApp) {
            return res.status(400).json({ status: 'fail', message: 'You already applied for this job' });
        }

        const resumeFile = req.files?.resume?.[0];
        const coverLetterFile = req.files?.coverLetter?.[0];

        if (!resumeFile) {
            return res.status(400).json({ status: 'fail', message: 'Resume is required as a file' });
        }

        const application = new Application({
            jobId,
            candidateId,
            resume: resumeFile ? `/uploads/resumes/${resumeFile.filename}` : undefined,
            coverLetter: coverLetterFile ? `/uploads/coverLetters/${coverLetterFile.filename}` : undefined
        });

        const savedApp = await application.save();
        job.applications.push(savedApp._id);
        await job.save();

        res.status(201).json({ status: 'success', data: savedApp });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Get logged-in user's applications
const getMyApplications = async (req, res) => {
    try {
        const apps = await Application.find({ candidateId: req.user._id })
            .populate('jobId', 'title company location employmentType');
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

        const apps = await Application.find({ candidateId: req.params.candidateId })
            .populate('jobId', 'title company location employmentType');
        res.status(200).json({ status: 'success', data: apps });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Get applications for a job (admin or job owner)
const getByJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job || !job.postedBy) {
            return res.status(404).json({ status: 'fail', message: 'Job not found' });
        }

        const isOwner = job.postedBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ status: 'fail', message: 'Not authorized to view applications for this job' });
        }

        const apps = await Application.find({ jobId: job._id })
            .populate('candidateId', 'firstName lastName email');
        res.status(200).json({ status: 'success', data: apps });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Update resume or cover letter (candidate or admin)
const updateApplication = async (req, res) => {
    try {
        const app = await Application.findById(req.params.id);
        if (!app) return res.status(404).json({ status: 'fail', message: 'Application not found' });

        if (req.user.role !== 'admin' && app.candidateId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
        }

        const resumeFile = req.files?.resume?.[0];
        const coverLetterFile = req.files?.coverLetter?.[0];

        if (resumeFile) app.resume = `/uploads/resumes/${resumeFile.filename}`;
        if (coverLetterFile) app.coverLetter = `/uploads/coverLetters/${coverLetterFile.filename}`;

        await app.save();
        res.status(200).json({ status: 'success', data: app });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Update application status (admin or employer)
const updateApplicationStatus = async (req, res) => {
    try {
        const app = await Application.findById(req.params.id);
        if (!app) return res.status(404).json({ status: 'fail', message: 'Application not found' });

        const job = await Job.findById(app.jobId);
        if (!job || !job.postedBy) {
            return res.status(404).json({ status: 'fail', message: 'Associated job not found' });
        }

        const isOwner = job.postedBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ status: 'fail', message: 'Unauthorized to update status' });
        }

        if (!VALID_STATUSES.includes(req.body.status)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid application status' });
        }

        app.status = req.body.status;
        await app.save();

        res.status(200).json({ status: 'success', data: app });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
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

    const job = await Job.findById(app.jobId);
    if (job) {
        await Job.findByIdAndUpdate(app.jobId, { $pull: { applications: app._id } });
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