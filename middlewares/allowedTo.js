const allowedTo = (...roles) => {
    try {
        return (req, res, next) => {
            // Check if the user is authenticated
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            let role = req.user.role;

            if (!roles.includes(role)) {
                return res.status(403).json({ status: 'fail', message: 'Forbidden: You do not have permission to perform this action' });
            }
            next();
        };
    } catch (error) {
        console.error('Error in allowedTo middleware:', error);
        return (req, res) => {
            res.status(500).json({ message: 'Internal Server Error' });
        };
    }
}

module.exports = allowedTo;