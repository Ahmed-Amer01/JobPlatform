const Admin = require('../models/userModel');
const bcrypt = require('bcryptjs');

// get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            data: {
                users
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get all candidates and employers
const getAllCandidates = async (req, res) => {
    try {
        const candidates = await User.find({ role: 'candidate' });
        res.status(200).json({
            status: 'success',
            data: {
                candidates
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const getAllEmployers = async (req, res) => {
    try {
        const employers = await User.find({ role: 'employer' });
        res.status(200).json({
            status: 'success',
            data: {
                employers
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({ role: 'admin' });
        res.status(200).json({
            status: 'success',
            data: {
                admins
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await Admin.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Create a new admin
const createAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password, dateOfBirth, phone, address } = req.body;
        if (!firstName || !lastName || !email || !password || !dateOfBirth || !phone) {
            return res.status(400).json({
                status: 'fail',
                message: 'All fields are required'
            });
        }
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                status: 'fail',
                message: 'Admin with this email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            dateOfBirth,
            phone,
            address,
            role: 'admin',
            photo: req.files?.photo ? req.files.photo[0].path : '/uploads/photos/defaultUserPhoto.jpg',
            resume: req.files?.resume ? req.files.resume[0].path : undefined
        });
        await newAdmin.save();

        res.status(201).json({
            status: 'success',
            data: {
                admin: newAdmin
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update an admin
const updateAdmin = async (req, res) => {
    try {
        const user = await Admin.findById(req.params.id);
        if (!user || user.role !== 'admin') {
            return res.status(404).json({
                status: 'fail',
                message: 'Admin not found'
            });
        }

        const fieldsToUpdate = ['firstName', 'lastName', 'email', 'dateOfBirth', 'phone', 'address'];
        fieldsToUpdate.forEach(field => {
            if (req.body[field]) {
                user[field] = req.body[field];
            }
        });
        
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        if (req.files?.photo) {
            user.photo = req.files.photo[0].path;
        }
        if (req.files?.resume) {
            user.resume = req.files.resume[0].path;
        }

        await user.save();
        res.status(200).json({
            status: 'success',
            data: {
                admin: user
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete an admin
const deleteAdmin = async (req, res) => {
    try {
        const user = await Admin.findById(req.params.id);
        if (!user || user.role !== 'admin') {
            return res.status(404).json({
                status: 'fail',
                message: 'Admin not found'
            });
        }
        
        await user.remove();
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getAllCandidates,
    getAllEmployers,
    getAllAdmins,
    getUserById,
    createAdmin,
    updateAdmin,
    deleteAdmin
};