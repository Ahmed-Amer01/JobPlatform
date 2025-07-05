const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id || req.user._id).select('-password'); // Exclude password from the response
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

// Update user
const updateUser = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                status: 'fail',
                message: 'User not found' 
            });
        }

        const fields = ['firstName', 'lastName', 'email', 'dateOfBirth', 'phone', 'address'];
        fields.forEach(field => {
            if (req.body[field]) user[field] = req.body[field];
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

// delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ 
            status: 'fail', 
            message: 'User not found' 
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
    getCurrentUser,
    updateUser,
    deleteUser
}