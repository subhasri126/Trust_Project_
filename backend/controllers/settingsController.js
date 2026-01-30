const { query } = require('../config/database');

/**
 * Site Settings Controller (MySQL)
 */
class SettingsController {
    async getSettings(req, res) {
        try {
            const result = await query('SELECT * FROM site_settings ORDER BY id DESC LIMIT 1');
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Settings not found' });
            }

            const settings = { ...result.rows[0] };
            if (!req.admin) delete settings.telegram_bot_token;

            res.json({ success: true, data: settings });
        } catch (error) {
            console.error('Get settings error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch settings' });
        }
    }

    async updateSettings(req, res) {
        try {
            const {
                site_name, tagline, telegram_bot_token, telegram_chat_id,
                contact_email, contact_phone, contact_address
            } = req.body;

            const checkResult = await query('SELECT id FROM site_settings LIMIT 1');

            if (checkResult.rows.length === 0) {
                await query(
                    `INSERT INTO site_settings (site_name, tagline, telegram_bot_token, telegram_chat_id, contact_email, contact_phone, contact_address) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [site_name, tagline, telegram_bot_token, telegram_chat_id, contact_email, contact_phone, contact_address]
                );
            } else {
                await query(
                    `UPDATE site_settings SET site_name = ?, tagline = ?, telegram_bot_token = ?, telegram_chat_id = ?, contact_email = ?, contact_phone = ?, contact_address = ? 
           WHERE id = ?`,
                    [site_name, tagline, telegram_bot_token, telegram_chat_id, contact_email, contact_phone, contact_address, checkResult.rows[0].id]
                );
            }

            res.json({ success: true, message: 'Settings updated successfully' });
        } catch (error) {
            console.error('Update settings error:', error);
            res.status(500).json({ success: false, message: 'Failed to update settings' });
        }
    }
}

module.exports = new SettingsController();
