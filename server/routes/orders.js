const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// @route   POST api/orders
// @desc    Create a new order (called when inquiry is submitted)
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { customerName, whatsapp, city, size, productName } = req.body;

        if (!customerName || !whatsapp || !city || !size || !productName) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        const trackingCode = await Order.generateTrackingCode();

        const newOrder = new Order({
            trackingCode,
            customerName,
            whatsapp,
            city,
            size,
            productName
        });

        const order = await newOrder.save();
        res.json({ trackingCode: order.trackingCode, orderId: order._id });
    } catch (err) {
        console.error('Error creating order:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/orders/track/:code
// @desc    Get order by tracking code (Public - customer facing)
// @access  Public
router.get('/track/:code', async (req, res) => {
    try {
        const code = req.params.code.toUpperCase();
        const order = await Order.findOne({ trackingCode: code });

        if (!order) {
            return res.status(404).json({ msg: 'Aucune commande trouvée avec ce code.' });
        }

        // Return only public info (no admin notes)
        res.json({
            trackingCode: order.trackingCode,
            customerName: order.customerName,
            productName: order.productName,
            status: order.status,
            craftingSteps: order.craftingSteps,
            estimatedDelivery: order.estimatedDelivery,
            createdAt: order.createdAt
        });
    } catch (err) {
        console.error('Error tracking order:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/orders/track/:code/email
// @desc    Update order email by tracking code (Public - immediately after checkout)
// @access  Public
router.put('/track/:code/email', async (req, res) => {
    try {
        const code = req.params.code.toUpperCase();
        const { email } = req.body;
        
        const order = await Order.findOne({ trackingCode: code });
        if (!order) {
            return res.status(404).json({ msg: 'Aucune commande trouvée avec ce code.' });
        }
        
        order.email = email;
        await order.save();
        
        res.json({ msg: 'Email updated successfully' });
    } catch (err) {
        console.error('Error updating order email:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/orders
// @desc    Get all orders (Admin)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/orders/:id
// @desc    Get single order by ID (Admin)
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        res.json(order);
    } catch (err) {
        console.error('Error fetching order:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/orders/:id
// @desc    Update order details (Admin - status, estimated delivery, notes)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const updateData = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!order) return res.status(404).json({ msg: 'Order not found' });
        res.json(order);
    } catch (err) {
        console.error('Error updating order:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/orders/:id/steps/:stepId
// @desc    Update a specific crafting step (Admin)
// @access  Private
router.put('/:id/steps/:stepId', auth, async (req, res) => {
    try {
        const { status, title, description } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ msg: 'Order not found' });

        const step = order.craftingSteps.id(req.params.stepId);
        if (!step) return res.status(404).json({ msg: 'Step not found' });

        if (title !== undefined) step.title = title;
        if (description !== undefined) step.description = description;
        if (status !== undefined) {
            step.status = status;
            if (status === 'completed') {
                step.completedAt = new Date();
            } else {
                step.completedAt = null;
            }
        }

        // Auto-update order status based on steps
        const allCompleted = order.craftingSteps.every(s => s.status === 'completed');
        const anyInProgress = order.craftingSteps.some(s => s.status === 'in-progress');
        
        if (allCompleted) {
            order.status = 'delivered';
        } else if (anyInProgress) {
            order.status = 'in-progress';
        }

        await order.save();
        res.json(order);
    } catch (err) {
        console.error('Error updating step:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/orders/:id/steps
// @desc    Add a new crafting step (Admin)
// @access  Private
router.post('/:id/steps', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ msg: 'Order not found' });

        order.craftingSteps.push({
            title: title || 'New Step',
            description: description || '',
            status: 'pending'
        });

        await order.save();
        res.json(order);
    } catch (err) {
        console.error('Error adding step:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/orders/:id/steps/:stepId
// @desc    Remove a crafting step (Admin)
// @access  Private
router.delete('/:id/steps/:stepId', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ msg: 'Order not found' });

        const step = order.craftingSteps.id(req.params.stepId);
        if (!step) return res.status(404).json({ msg: 'Step not found' });

        step.deleteOne();
        await order.save();
        res.json(order);
    } catch (err) {
        console.error('Error removing step:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/orders/:id
// @desc    Delete an order (Admin)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        res.json({ msg: 'Order removed' });
    } catch (err) {
        console.error('Error deleting order:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
