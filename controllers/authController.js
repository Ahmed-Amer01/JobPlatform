const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const COOKIE_NAME = '_clerk_db_jwt';    

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
}

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, dateOfBirth, phone, address, role } = req.body;
        if (!firstName || !lastName || !email || !password || !dateOfBirth || !phone ) {
            return res.status(400).json({
                status: 'fail',
                message: 'All fields are required'
            });
        }

        if (!['candidate', 'employer'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role selected' });
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
            role,
            photo: req.files?.photo ? req.files.photo[0].path : '/uploads/photos/defaultUserPhoto.jpg',
            resume: req.files?.resume ? req.files.resume[0].path : undefined
        });
        await newUser.save();

        const token = generateToken(newUser);

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

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user);

        
        console.log('Setting cookie with token:', token ? 'Token generated' : 'No token');
        console.log('Cookie name:', COOKIE_NAME);

        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        });

        // Debug: Check if cookie was set
        console.log('Response headers after setting cookie:', res.getHeaders());

        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone
                },
                token // Remove this in production for security
            }
        });
    } catch (error) {
        console.error('Login error:', error);
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