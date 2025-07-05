const mongoose = require('mongoose');
const validator = require('validator');
const dayjs = require('dayjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide your first name'],
        maxlength: [50, 'First name cannot exceed 50 characters'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please provide your last name'],
        maxlength: [50, 'Last name cannot exceed 50 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Do not return password in queries
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please provide your date of birth'],
        // Custom validation to ensure user is at least 18 years old
        validate: {
            validator: function(v) {
                const today = dayjs();
                const birthDate = dayjs(v);
                return today.diff(birthDate, 'year') >= 18; // User must be at least 18 years old
            },
            message: 'You must be at least 18 years old'
        }
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number'],
        validate: {
            validator: function(v) {
                return /^\+?[1-9]\d{1,14}$/.test(v); // Validate E.164 format
            },
            message: 'Please provide a valid phone number'
        }
    },
    address: {
        type: String,required: [true, 'Please provide your address'],
        maxlength: [100, 'Address cannot exceed 100 characters'],
        trim: true
    },
    photo: {
        type: String,
        default: '/uploads/photos/defaultUserPhoto.jpg',
        validate: {
            validator: function(v) {
            return /\.(jpg|jpeg|png|gif)$/i.test(v) || validator.isURL(v);
            },
            message: 'Please provide a valid image URL or filename' // Validate for image file types on file name or URL
        }
    },
    resume: {
        type: String,
        validate: {
            validator: function(v) {
            return /\.(pdf|docx?|txt)$/i.test(v) || validator.isURL(v);
            },
            message: 'Please provide a valid resume file or URL' // Validate for resume file types on file name or URL
        }
    },
    role: {
        type: String,
        enum: ['admin', 'employer', 'candidate'],
        default: 'candidate',
        required: true 
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;