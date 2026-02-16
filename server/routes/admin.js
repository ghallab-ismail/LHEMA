const express = require('express');
const router = express.Router();

// @route   POST api/admin/login
// @desc    Verify admin password
// @access  Public
router.post('/login', (req, res) => {
    const { password } = req.body;

    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true, token: 'admin-authorized-session' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

module.exports = router;
