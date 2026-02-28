const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const Inquiry = require('../models/Inquiry');
const auth = require('../middleware/auth');

// --- Resend email client setup (uses HTTPS, not blocked by Render) ---
const resend = new Resend(process.env.RESEND_API_KEY);

const sendNotificationEmail = async (inquiry) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `Maison Lhema <${process.env.RESEND_FROM_EMAIL}>`,
            to: [process.env.NOTIFY_EMAIL],
            subject: `✨ Nouvelle Demande — ${inquiry.productName}`,
            html: `
                <div style="font-family: 'Georgia', serif; max-width: 560px; margin: 0 auto; background: #0a0a0a; color: #e7e5e4; border-radius: 12px; overflow: hidden;">
                    <div style="background: #141414; padding: 32px 28px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06);">
                        <h1 style="margin: 0; font-size: 22px; font-weight: 400; color: #ffffff; letter-spacing: 2px;">MAISON LHEMA</h1>
                        <p style="margin: 8px 0 0; font-size: 10px; letter-spacing: 4px; color: #78716c; text-transform: uppercase;">Nouvelle Demande de Conciergerie</p>
                    </div>
                    <div style="padding: 28px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #78716c; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; width: 120px;">Client</td>
                                <td style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #ffffff; font-size: 15px;">${inquiry.name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #78716c; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;">WhatsApp</td>
                                <td style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #ffffff; font-size: 15px;">
                                    <a href="https://wa.me/${inquiry.whatsapp}" style="color: #22c55e; text-decoration: none;">${inquiry.whatsapp}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #78716c; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;">Produit</td>
                                <td style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #ffffff; font-size: 15px;">${inquiry.productName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #78716c; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;">Taille</td>
                                <td style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #ffffff; font-size: 15px;">${inquiry.size}</td>
                            </tr>
                            <tr>
                                <td style="padding: 14px 0; color: #78716c; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;">Ville</td>
                                <td style="padding: 14px 0; color: #ffffff; font-size: 15px;">${inquiry.city}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="padding: 20px 28px; background: #141414; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
                        <p style="margin: 0; font-size: 11px; color: #57534e;">Reçue le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Email notification error:', error);
        } else {
            console.log('Email notification sent:', data.id);
        }
    } catch (err) {
        console.error('Email notification error:', err);
    }
};

// @route   POST api/inquiries
// @desc    Create a new inquiry (Public client-facing)
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

        // Send email notification (non-blocking)
        sendNotificationEmail(inquiry);

        res.json(inquiry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/inquiries/admin
// @desc    Create a new inquiry (Admin manual entry)
// @access  Private (Admin)
router.post('/admin', auth, async (req, res) => {
    try {
        const { name, whatsapp, city, size, productName, status } = req.body;

        const newInquiry = new Inquiry({
            name,
            whatsapp,
            city,
            size,
            productName,
            status: status || 'pending'
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
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/inquiries/bulk-status
// @desc    Update status for multiple inquiries
// @access  Private (Admin)
router.put('/bulk-status', auth, async (req, res) => {
    try {
        const { ids, status } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ msg: 'No inquiry IDs provided' });
        }

        await Inquiry.updateMany(
            { _id: { $in: ids } },
            { $set: { status } }
        );

        res.json({ msg: 'Inquiries updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/inquiries/bulk-delete
// @desc    Delete multiple inquiries
// @access  Private (Admin)
router.post('/bulk-delete', auth, async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ msg: 'No inquiry IDs provided' });
        }

        await Inquiry.deleteMany({ _id: { $in: ids } });

        res.json({ msg: 'Inquiries deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/inquiries/completed-count
// @desc    Get count of completed inquiries for a specific product
// @access  Public
router.get('/completed-count', async (req, res) => {
    try {
        const { productName, productId } = req.query;

        if (!productName && !productId) {
            return res.status(400).json({ msg: 'Product Name or ID is required' });
        }

        const orConditions = [];
        if (productName) {
            orConditions.push({ productName: productName });
        }
        if (productId) {
            orConditions.push({ productId: productId }); // Although productId isn't saved yet, good future proofing.
        }

        // Handle database history where the name might be the English "The Signature Cape"
        if (productId === 'the-signature-cape' || productName?.includes('Veste-Cape')) {
            orConditions.push({ productName: 'The Signature Cape' });
        }

        const count = await Inquiry.countDocuments({
            $or: orConditions,
            status: 'completed'
        });

        res.json({ count });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/inquiries/:id
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const updateData = req.body;
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!inquiry) return res.status(404).json({ msg: 'Inquiry not found' });

        res.json(inquiry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/inquiries/:id
// @desc    Delete an inquiry
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

        if (!inquiry) return res.status(404).json({ msg: 'Inquiry not found' });

        res.json({ msg: 'Inquiry removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Inquiry not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
