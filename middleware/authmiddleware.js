const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log('🔍 JWT Middleware called for:', req.originalUrl); // Log which route is calling middleware

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('❌ No token found in request headers');
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract token

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('❌ JWT Verification Failed:', err.message);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        console.log('✅ JWT Verified. Decoded Token:', decoded);
        req.user = decoded; // Store decoded data in req.user
        next();
    });
};

module.exports = verifyToken;
