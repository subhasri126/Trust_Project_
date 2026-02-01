require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Route imports
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const causesRoutes = require('./routes/causesRoutes');
const donationRoutes = require('./routes/donationRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const postsRoutes = require('./routes/postsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
// app.use(helmet()); // Temporarily disabled for debugging UI issues
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);

// Static Files for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Frontend Static Files Explicitly (Best Practice)
app.use('/css', (req, res, next) => {
    console.log(`[DEBUG] CSS Request: ${req.url}`);
    next();
}, express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Serve Index HTML for Root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/causes', causesRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contacts', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Start server
const os = require('os');
const networkInterfaces = os.networkInterfaces();
const addresses = [];
for (const k in networkInterfaces) {
    for (const k2 in networkInterfaces[k]) {
        const address = networkInterfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
🚀 Server is running on port ${PORT}
🌍 Local:            http://localhost:${PORT}
🌐 Network IPs:      ${addresses.map(a => `http://${a}:${PORT}`).join(', ')}
    `);
});
