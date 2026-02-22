const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

// @route   POST api/admin/login
// @desc    Verify admin password
// @access  Public
router.post('/login', (req, res) => {
    const { password } = req.body;

    if (password === process.env.ADMIN_PASSWORD) {
        // Sign token
        jwt.sign(
            { role: 'admin' },
            process.env.ADMIN_PASSWORD, // Using admin password as secret key for simplicity in this setup
            { expiresIn: '4h' },
            (err, token) => {
                if (err) throw err;
                res.json({ success: true, token });
            }
        );
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

module.exports = router;
