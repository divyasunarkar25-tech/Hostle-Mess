const jwt = require('jsonwebtoken');

const adminAuthMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Verify the token specifically belongs to an admin
            if (decoded.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized, not an admin' });
            }

            // Attach decoded payload to req.admin
            req.admin = decoded;

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = adminAuthMiddleware;
