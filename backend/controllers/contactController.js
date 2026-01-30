const { query } = require('../config/database');
const { sendTelegramNotification } = require('../services/telegram');

/**
 * Submit a contact message
 */
exports.submitContact = async (req, res, next) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and message'
            });
        }

        const result = await query(
            'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, subject, message]
        );

        // Notify via Telegram
        await sendTelegramNotification(
            `📩 *New Contact Message*\n\n*Name:* ${name}\n*Email:* ${email}\n*Subject:* ${subject || 'N/A'}\n*Message:* ${message}`
        );

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: { id: result.rows.insertId }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all contact messages (Admin only)
 */
exports.getContacts = async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Update contact message status (Admin only)
 */
exports.updateContactStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await query('UPDATE contacts SET status = ? WHERE id = ?', [status, id]);

        res.json({
            success: true,
            message: 'Status updated'
        });
    } catch (err) {
        next(err);
    }
};
