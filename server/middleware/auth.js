const auth = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        if (token === 'admin-authorized-session') {
            next();
        } else {
            res.status(401).json({ msg: 'Token is not valid' });
        }
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
