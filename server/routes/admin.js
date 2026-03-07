const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// @route   POST api/admin/login
// @desc    Verify admin password against hashed password in database
// @access  Public
router.post('/login', async (req, res) => {
    const { password } = req.body;

    try {
        // Find the admin user in the database
        const admin = await Admin.findOne({ username: 'admin' });
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Admin account not found. Run seedAdmin.js first.' });
        }

        // Compare submitted password with the hashed password
        const isMatch = await bcrypt.compare(password, admin.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Sign token with JWT_SECRET (not the password)
        const token = jwt.sign(
            { role: 'admin', id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );

        res.json({ success: true, token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
