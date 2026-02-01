const { query } = require('../config/database');
const telegramService = require('../services/telegram');
const emailService = require('../services/email');

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

        // 1. Store in Database
        const result = await query(
            'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, subject, message]
        );

        const contactData = {
            id: result.insertId || result.rows.insertId, // Handle mysql2 vs standard response
            name, email, phone, subject, message,
            created_at: new Date()
        };

        // 2. Send Telegram Notification (Admin)
        // Must happen after DB insert. We await it to ensure admin is notified before success (per requirement "immediately after DB")
        // But we catch errors so it doesn't fail the request or block email
        try {
            const telegramMsg = `📩 <b>New Contact Message</b>\n\n` +
                `👤 <b>Name:</b> ${name}\n` +
                `📧 <b>Email:</b> ${email}\n` +
                `📱 <b>Phone:</b> ${phone || 'N/A'}\n` +
                `📝 <b>Subject:</b> ${subject || 'N/A'}\n` +
                `💬 <b>Message:</b> ${message}\n` +
                `📅 <b>Date:</b> ${new Date().toLocaleString()}`;

            await telegramService.sendMessage(telegramMsg);
        } catch (tgError) {
            console.error('Telegram notification failed:', tgError.message);
        }

        // 3. Send Email Acknowledgement (User)
        // "Email sending must not block the response" -> We do NOT await this promise
        // The service handles its own error logging
        emailService.sendAcknowledgement(email, name);

        // 4. Return Success Response
        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: { id: contactData.id }
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
