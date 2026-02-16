const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// @route   POST api/inquiries
// @desc    Create a new inquiry
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, whatsapp, city, size, productName } = req.body;

        const newInquiry = new Inquiry({
            name,
            whatsapp,
            city,
            size,
            productName
        });

        const inquiry = await newInquiry.save();
        res.json(inquiry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/inquiries
// @desc    Get all inquiries
// @access  Public
router.get('/', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/inquiries/:id
// @desc    Update inquiry status
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(inquiry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
