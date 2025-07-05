const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');
const mongoose = require('mongoose');

// Get all jobs (public)
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

// Get job by ID (public + increment views)
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

// Create a job (admin or employer)
const createJob = async (req, res) => {
    try {
        const { title, description, company, location, employmentType, requirements, skills } = req.body;

        const newJob = new Job({
            title,
            description,
            company,
            location,
            employmentType,
            requirements,
            skills: Array.isArray(skills) ? skills : [skills],
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

        const updatableFields = ['title', 'description', 'company', 'location', 'employmentType', 'requirements', 'skills', 'isActive'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) job[field] = req.body[field];
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
