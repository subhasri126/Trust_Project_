const axios = require('axios');

/**
 * Telegram Notification Service
 * Sends donation alerts to Telegram
 */
class TelegramService {
    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.TELEGRAM_CHAT_ID;
        this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
    }

    /**
     * Check if Telegram is configured
     */
    isConfigured() {
        return !!(this.botToken && this.chatId);
    }

    /**
     * Send donation notification
     */
    async sendDonationNotification(donation) {
        if (!this.isConfigured()) {
            console.log('⚠️ Telegram not configured. Skipping notification.');
            return { success: false, message: 'Telegram not configured' };
        }

        try {
            const message = this.formatDonationMessage(donation);

            const response = await axios.post(`${this.baseUrl}/sendMessage`, {
                chat_id: this.chatId,
                text: message,
                parse_mode: 'HTML'
            });

            console.log('✅ Telegram notification sent successfully');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('❌ Failed to send Telegram notification:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Format donation message for Telegram
     */
    formatDonationMessage(donation) {
        const { donor_name, amount, email, phone, message, donation_date } = donation;

        let text = '🎉 <b>NEW DONATION RECEIVED!</b>\n\n';
        text += `👤 <b>Donor:</b> ${donor_name}\n`;
        text += `💰 <b>Amount:</b> $${parseFloat(amount).toFixed(2)}\n`;

        if (email) {
            text += `📧 <b>Email:</b> ${email}\n`;
        }

        if (phone) {
            text += `📱 <b>Phone:</b> ${phone}\n`;
        }

        if (message) {
            text += `💬 <b>Message:</b> ${message}\n`;
        }

        text += `📅 <b>Date:</b> ${new Date(donation_date).toLocaleString()}\n`;
        text += '\n✨ Thank you for your generosity!';

        return text;
    }

    /**
     * Send custom message
     */
    async sendMessage(text) {
        if (!this.isConfigured()) {
            console.log('⚠️ Telegram not configured. Skipping notification.');
            return { success: false, message: 'Telegram not configured' };
        }

        try {
            const response = await axios.post(`${this.baseUrl}/sendMessage`, {
                chat_id: this.chatId,
                text: text,
                parse_mode: 'HTML'
            });

            return { success: true, data: response.data };
        } catch (error) {
            console.error('❌ Failed to send Telegram message:', error.message);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new TelegramService();
