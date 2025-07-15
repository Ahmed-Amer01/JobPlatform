const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');
const mongoose = require('mongoose');

// Enum for Employment Types
const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'internship'];

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
            location: location?.trim() || 'online',
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
                job.skills = Array.isArray(req.body.skills) ? req.body.skills : (req.body.skills ? [req.body.skills] : []);
            } else if (req.body[field] !== undefined && req.body[field].toString().trim() !== '') {
                job[field] = req.body[field];
            }
        });

        await job.save();

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

        await Job.findByIdAndDelete(req.params.id);
        await Application.deleteMany({ jobId: job._id });

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
    getJobApplications
};