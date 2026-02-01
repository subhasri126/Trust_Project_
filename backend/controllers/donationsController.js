const { query } = require('../config/database');
const telegramService = require('../services/telegram');
const emailService = require('../services/email');

/**
 * Donations Controller (MySQL)
 */
class DonationsController {
    async submitDonation(req, res) {
        try {
            let { donor_name, amount, email, phone, message, payment_method, transaction_id } = req.body;

            // Default values for missing fields to prevent DB errors
            if (!transaction_id) {
                transaction_id = 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            }
            if (!payment_method) {
                payment_method = 'Online';
            }

            // 1. Database Insert (The critical part)
            const result = await query(
                `INSERT INTO donations (donor_name, amount, email, phone, message, payment_method, transaction_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [donor_name, amount, email, phone, message, payment_method, transaction_id]
            );

            // Construct donation object for notifications
            const donationData = {
                id: result.insertId || result.rows.insertId, // Handle mysql2 vs pg structure
                donor_name,
                amount,
                email,
                phone,
                message,
                donation_date: new Date()
            };

            // 2. Notifications (Non-blocking / Fire-and-forget)
            // We do NOT await these to ensure the user gets a fast response.
            // Even if they fail, the donation is already recorded safe in DB.

            // Telegram Notification
            telegramService.sendDonationNotification(donationData)
                .catch(err => console.error('⚠️ Telegram notification failed:', err.message));

            // Email Acknowledgement (if email is provided)
            if (email) {
                // Use the same acknowledgement method or create a specific donation one if needed.
                // For now, reusing the generic acknowledgement is better than nothing, 
                // but ideally we'd have a specific `sendDonationReceipt`.
                // Since the user asked for "Email acknowledgement", generic is likely fine or we can extend emailService later.
                emailService.sendAcknowledgement(email, donor_name)
                    .catch(err => console.error('⚠️ Email acknowledgement failed:', err.message));
            }

            // 3. Return Success Response
            res.status(201).json({
                success: true,
                message: 'Thank you for your generous donation!',
                data: donationData
            });

        } catch (error) {
            console.error('❌ Submit donation error:', error);
            res.status(500).json({ success: false, message: 'Failed to process donation' });
        }
    }

    async getAllDonations(req, res) {
        try {
            let { status, limit = 100, offset = 0 } = req.query;
            limit = parseInt(limit);
            offset = parseInt(offset);

            let queryText = 'SELECT * FROM donations';
            const params = [];

            if (status) {
                queryText += ' WHERE status = ?';
                params.push(status);
            }

            queryText += ' ORDER BY donation_date DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const result = await query(queryText, params);

            const countQuery = status
                ? 'SELECT COUNT(*) as count FROM donations WHERE status = ?'
                : 'SELECT COUNT(*) as count FROM donations';
            const countParams = status ? [status] : [];
            const countResult = await query(countQuery, countParams);

            res.json({
                success: true,
                data: {
                    donations: result.rows,
                    total: countResult.rows[0].count,
                    limit,
                    offset
                }
            });
        } catch (error) {
            console.error('Get donations error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch donations' });
        }
    }

    async getDonationById(req, res) {
        try {
            const { id } = req.params;
            const result = await query('SELECT * FROM donations WHERE id = ?', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Donation not found' });
            }
            res.json({ success: true, data: result.rows[0] });
        } catch (error) {
            console.error('Get donation error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch donation' });
        }
    }

    async updateDonationStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await query('UPDATE donations SET status = ? WHERE id = ?', [status, id]);
            if (result.rowCount === 0) {
                return res.status(404).json({ success: false, message: 'Donation not found' });
            }
            res.json({ success: true, message: 'Donation status updated successfully' });
        } catch (error) {
            console.error('Update donation status error:', error);
            res.status(500).json({ success: false, message: 'Failed to update donation status' });
        }
    }

    async getDonationStats(req, res) {
        try {
            const totalResult = await query('SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total_amount FROM donations');
            const statusResult = await query('SELECT status, COUNT(*) as count, COALESCE(SUM(amount), 0) as total_amount FROM donations GROUP BY status');
            const recentResult = await query("SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total_amount FROM donations WHERE donation_date >= NOW() - INTERVAL 30 DAY");

            res.json({
                success: true,
                data: {
                    total: { count: totalResult.rows[0].count, amount: parseFloat(totalResult.rows[0].total_amount) },
                    by_status: statusResult.rows.map(row => ({
                        status: row.status, count: row.count, amount: parseFloat(row.total_amount)
                    })),
                    last_30_days: { count: recentResult.rows[0].count, amount: parseFloat(recentResult.rows[0].total_amount) }
                }
            });
        } catch (error) {
            console.error('Get donation stats error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
        }
    }
}

module.exports = new DonationsController();
