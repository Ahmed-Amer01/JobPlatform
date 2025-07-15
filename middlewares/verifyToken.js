const jwt  = require('jsonwebtoken');
const User = require('../models/userModel');
const COOKIE_NAME = '_clerk_db_jwt';    
const verifyToken = async (req, res, next) => {

  //  console.log('Received cookies:', req.cookies);
  try {
    
    let token;

    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    /* 2️⃣  Fallback: try cookie */
    if (!token && req.cookies) {
      token = req.cookies[COOKIE_NAME];
    }

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    /* 3️⃣  Verify */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    console.log(decoded.id)
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user;          // attach user to request
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = verifyToken;
