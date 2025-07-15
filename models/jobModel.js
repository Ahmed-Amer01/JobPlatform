const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide the job title'],
        maxlength: [100, 'Job title cannot exceed 100 characters'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide the job description'],
        maxlength: [10000, 'Job description cannot exceed 10000 characters']
    },
    company: {
        type: String,
        required: [true, 'Please provide the company name'],
        maxlength: [100, 'Company name cannot exceed 100 characters'],
        trim: true
    },
    location: {
        type: String,
        default: 'online',
        maxlength: [100, 'Location cannot exceed 100 characters'],
        trim: true
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'internship'],
        required: [true, 'Please provide the employment type']
    },
    requirements: {
        type: String,
        required: [true, 'Please provide the job requirements'],
        maxlength: [10000, 'Requirements cannot exceed 10000 characters']
    },
    skills: {
        type: [String],
        validate: {
            validator: function (v) {
                return v.every(skill => typeof skill === 'string' && skill.trim() !== '');
            },
            message: 'All skills must be non-empty strings'
        }
    },
    views: {
        type: Number,
        default: 0,
        min: [0, 'Views cannot be negative']
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide the user ID of the job poster']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }]
}, {
    timestamps: true
});

// Text index for search
jobSchema.index({ title: 'text', company: 'text', location: 'text' });

const jobModel = mongoose.model('Job', jobSchema);
module.exports = jobModel;