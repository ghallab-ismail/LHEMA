/**
 * One-time script to seed the admin user into MongoDB.
 * 
 * Usage:  node seedAdmin.js
 * 
 * It reads ADMIN_PASSWORD from .env, hashes it with bcrypt,
 * and upserts an admin record in the database.
 * After running this, you can remove ADMIN_PASSWORD from .env.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const seed = async () => {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
        console.error('❌ ADMIN_PASSWORD not found in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Upsert: update if admin exists, create if not
        await Admin.findOneAndUpdate(
            { username: 'admin' },
            { username: 'admin', passwordHash },
            { upsert: true, new: true }
        );

        console.log('✅ Admin user seeded successfully (password hashed with bcrypt)');
        console.log('💡 You can now remove ADMIN_PASSWORD from your .env file');
    } catch (err) {
        console.error('❌ Error seeding admin:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

seed();
