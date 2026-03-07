require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'https://lhema.vercel.app', 'https://maisonlhema.com', 'https://www.maisonlhema.com', /\.vercel\.app$/],
    credentials: true,
}));
app.set('trust proxy', 1); // Enable trusting the reverse proxy (Vercel) for rate limiting
app.use(express.json());

// Rate Limiting (apply to all requests or specific routes)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use('/api', limiter); // Apply rate limiter to all /api routes

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
// app.use('/api/products', require('./routes/products'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/admin', require('./routes/admin'));

// Health check endpoint (used by frontend wake-up ping & cron-job keep-alive)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
    res.send('Maison Lhema API Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
