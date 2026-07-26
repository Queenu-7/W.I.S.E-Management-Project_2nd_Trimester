const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.'});
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Token missing' });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
            return res.status(500).json({ error: 'Internal server configuration error.' });
        }

        const payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};
