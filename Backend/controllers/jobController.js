const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');
const { createNotification } = require('../services/notificationService');

// Enum for Employment Types
const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'internship'];

// Get jobs posted by the logged-in employer
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            status: 'success',
            count: jobs.length,
            data: jobs
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Search jobs by title, company, or location (partial & combined search)
const searchJobs = async (req, res) => {
    try {
        let { title, company, location } = req.query;

        title = title ? title.trim() : '';
        company = company ? company.trim() : '';
        location = location ? location.trim() : '';

        if (!title && !company && !location) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide at least one search parameter (title, company, or location)'
            });
        }

        const filter = {};
        const conditions = [];

        if (title) {
            conditions.push({ title: { $regex: title, $options: 'i' } });
        }
        if (company) {
            conditions.push({ company: { $regex: company, $options: 'i' } });
        }
        if (location) {
            conditions.push({ location: { $regex: location, $options: 'i' } });
        }

        if (conditions.length > 0) {
            filter.$and = conditions; // All conditions must match
        }

        const jobs = await Job.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            count: jobs.length,
            data: jobs
        });

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Get all jobs (with pagination & search)
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'firstName lastName email');
        res.status(200).json({
            status: 'success',
            data: jobs
        });

    } catch (err) {
        res.status(500).json({ 
            status: 'error', 
            message: err.message 
        });
    }
};

// Get job by ID (increment views)
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'firstName lastName email');

        if (!job) {
            return res.status(404).json({ 
                status: 'fail', 
                message: 'Job not found' 
            });
        }

        job.views += 1;
        await job.save();

        res.status(200).json({ 
            status: 'success', 
            data: job 
        });

    } catch (err) {
        res.status(500).json({ 
            status: 'error', 
            message: err.message 
        });
    }
};

// Create a job
const createJob = async (req, res) => {
    try {
        const { title, description, company, location, employmentType, requirements, skills } = req.body;

        // Basic validation
        if (!title || !description || !company || !employmentType || !requirements) {
            return res.status(400).json({ status: 'fail', message: 'Required fields missing' });
        }

        // Enum check for employmentType
        if (!EMPLOYMENT_TYPES.includes(employmentType.toLowerCase())) {
            return res.status(400).json({ status: 'fail', message: 'Invalid employment type' });
        }

        const newJob = new Job({
            title: title.trim(),
            description: description.trim(),
            company: company.trim(),
            location: location?.trim() || 'remote',
            employmentType,
            requirements: requirements.trim(),
            skills: Array.isArray(skills) ? skills : (skills ? [skills] : []),
            postedBy: req.user._id
        });

        await newJob.save();

        res.status(201).json({ 
            status: 'success', 
            data: newJob 
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error', 
            message: err.message 
        });
    }
};

// Update job
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                status: 'fail',
                message: 'Job not found'
            });
        }

        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'Not authorized to update this job'
            });
        }

        const { employmentType } = req.body;
        if (employmentType && !EMPLOYMENT_TYPES.includes(employmentType.toLowerCase())) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid employment type'
            });
        }

        const updatableFields = ['title', 'description', 'company', 'location', 'employmentType', 'requirements', 'skills', 'isActive'];
            updatableFields.forEach(field => {
                if (field === 'skills' && req.body.skills !== undefined) {
                    job.skills = Array.isArray(req.body.skills)
                        ? req.body.skills
                        : (req.body.skills ? [req.body.skills] : []);
                } else if (req.body[field] !== undefined && req.body[field].toString().trim() !== '') {
                    job[field] = req.body[field];
                }
            });

        await job.save();

        // notify all users who applied for that job
        const applications = await Application.find({ jobId: job._id });
        await Promise.all(applications.map(app => 
            createNotification({
                userId: app.candidateId,
                senderId: req.user._id,
                type: 'job_update',
                message: `The job "${job.title}" you applied for has been updated.`,
                jobId: job._id
            })
        ));

        res.status(200).json({ status: 'success', data: job });

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Delete job
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ 
                status: 'fail', 
                message: 'Job not found' 
            });
        }

        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ 
                status: 'fail', 
                message: 'Not authorized to delete this job' 
            });
        }

        const applications = await Application.find({ jobId: job._id });
        await Job.findByIdAndDelete(req.params.id);
        await Application.deleteMany({ jobId: job._id });

        await Promise.all(applications.map(app => 
            createNotification({
                userId: app.candidateId,
                senderId: req.user._id,
                type: 'job_deleted',
                message: `The job "${job.title}" you applied for has been removed.`,
                jobId: job._id
            })
        ));

        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ 
            status: 'error', 
            message: err.message
         });
    }
};

// GET applications of a job
const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate({
            path: 'applications',
            populate: {
                path: 'candidateId',
                select: 'firstName lastName email'
            }
        });

        if (!job) {
            return res.status(404).json({ status: 'fail', message: 'Job not found' });
        }

        const isOwner = job.postedBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                status: 'fail',
                message: 'Not authorized to view applications for this job'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                jobId: job._id,
                title: job.title,
                applications: job.applications
            }
        });

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getJobApplications,
    getMyJobs,
    searchJobs
};