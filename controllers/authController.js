const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
}

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, dateOfBirth, phone, address} = req.body;
        if (!firstName || !lastName || !email || !password || !dateOfBirth || !phone ) {
            return res.status(400).json({
                status: 'fail',
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'User with this email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            dateOfBirth,
            phone,
            address,
            role: 'user',
            photo: (req.files && req.files.photo && req.files.photo.length > 0 && req.files.photo[0].path)
                    ? req.files.photo[0].path
                    : '/uploads/photos/defaultUserPhoto.jpg',
                    
            resume: (req.files && req.files.resume && req.files.resume.length > 0 && req.files.resume[0].path)
                    ? req.files.resume[0].path
                    : undefined
        });
        await newUser.save();

        const token = generateToken(newUser);
        newUser.password = undefined;

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Login function
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email and password are required'
            });
        }

        // +password because the model does not return the password by default
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user);
        user.password = undefined;

        res.status(200).json({
            status: 'success',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Logout function
const logout = (req, res) => {
    // Invalidate the token by not sending it back to the client
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
};

module.exports = {
    register,
    login,
    logout
};