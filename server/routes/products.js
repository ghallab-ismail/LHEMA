const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
    try {
        const {
            name, description, price, currency, category, images, sizes,
            stars, stock, total_edition, is_limited_edition,
            description_title, description_subtitle, features, isAvailable
        } = req.body;

        if (!name || !category) {
            return res.status(400).json({ msg: 'Name and category are required' });
        }

        const product = new Product({
            name,
            description: description || '',
            price: price || 0,
            currency: currency || 'MAD',
            category,
            images: images || [],
            sizes: sizes || [],
            stars: stars !== undefined ? stars : 5,
            stock: stock !== undefined ? stock : 10,
            total_edition: total_edition !== undefined ? total_edition : 10,
            is_limited_edition: is_limited_edition !== undefined ? is_limited_edition : true,
            description_title: description_title || '',
            description_subtitle: description_subtitle || '',
            features: features || [],
            isAvailable: isAvailable !== undefined ? isAvailable : true
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
