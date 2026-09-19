const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    let token;

    // Check if standard Authorization header is present and formed correctly
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format is "Bearer token")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token securely with our secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the decoded token payload to req.user
            req.user = decoded;

            // Allow request to proceed to the controller
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    } else {
        // Request is missing the correct authorization header
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = authMiddleware;
