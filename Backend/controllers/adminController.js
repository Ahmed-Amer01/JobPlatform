const Admin = require('../models/userModel');
const bcrypt = require('bcryptjs');

// get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await Admin.find();
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
            photo: (req.files && req.files.photo && req.files.photo.length > 0 && req.files.photo[0].path)
                    ? req.files.photo[0].path
                    : 'uploads/photos/defaultUserPhoto.jpg',

            resume: (req.files && req.files.resume && req.files.resume.length > 0 && req.files.resume[0].path)
                    ? req.files.resume[0].path
                    : undefined
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
const updateAdminOrUser = async (req, res) => {
    try {
        const user = await Admin.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
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

        if (req.files && req.files.photo && req.files.photo.length > 0 && req.files.photo[0].path) {
            user.photo = req.files.photo[0].path;
        }
        else{
            user.photo = 'uploads/photos/defaultUserPhoto.jpg';
        }

        if (req.files && req.files.resume && req.files.resume.length > 0 && req.files.resume[0].path) {
            user.resume = req.files.resume[0].path;
        }
        else{
            user.resume = undefined;
        }

        await user.save();
        res.status(200).json({
            status: 'success',
            data: {
                user: user
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
const deleteAdminOrUser = async (req, res) => {
    try {
        const user = await Admin.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }
        
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
    getAllAdmins,
    getUserById,
    createAdmin,
    updateAdminOrUser,
    deleteAdminOrUser
};