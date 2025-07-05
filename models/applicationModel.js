const mongoose = require('mongoose');
const validator = require('validator');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, 'Please provide the job ID']
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide the candidate ID']
    },
    resume: {
        type: String,
        required: [true, 'Please provide a resume URL'],
        validate: {
            validator: function(v) {
            return /\.(pdf|docx?|txt)$/i.test(v) || validator.isURL(v);
            },
            message: 'Please provide a valid resume file or URL' // Validate for resume file types on file name or URL
        }
    },
    coverLetter: {
        type: String,
        required: [true, 'Please provide a cover letter'],
        maxlength: [500, 'Cover letter cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['applied', 'under_review', 'interviewed', 'hired', 'rejected'],
        default: 'applied',
        required: true
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

const applicationModel = mongoose.model('Application', applicationSchema);
module.exports = applicationModel;