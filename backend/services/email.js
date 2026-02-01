const nodemailer = require('nodemailer');

/**
 * Email Notification Service
 * Sends automated emails to users
 */
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', // Default to gmail, but allow override via host/port
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    /**
     * Check if email is configured
     */
    isConfigured() {
        return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
    }

    /**
     * Send acknowledgement email to user
     * @param {string} to - User's email
     * @param {string} name - User's name
     */
    async sendAcknowledgement(to, name) {
        if (!this.isConfigured()) {
            console.log('⚠️ Email not configured. Skipping acknowledgement.');
            return { success: false, message: 'Email not configured' };
        }

        try {
            console.log(`📧 Sending acknowledgement to ${to}...`);

            const mailOptions = {
                from: `"Hope Foundation" <${process.env.SMTP_USER}>`,
                to: to,
                subject: 'We have received your message - Hope Foundation',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #4a5568;">Hello ${name},</h2>
                        <p style="color: #4a5568; line-height: 1.6;">
                            Thank you for reaching out to <strong>Hope Foundation</strong>. We have successfully received your message.
                        </p>
                        <p style="color: #4a5568; line-height: 1.6;">
                            One of our team members will review your enquiry and get back to you as soon as possible.
                        </p>
                        <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0; color: #718096; font-size: 14px;">
                                This is an automated message. Please do not reply directly to this email.
                            </p>
                        </div>
                        <p style="color: #4a5568;">
                            Warm regards,<br>
                            <strong>The Hope Foundation Team</strong>
                        </p>
                    </div>
                `
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Acknowledgement email sent:', info.messageId);
            return { success: true, data: info };
        } catch (error) {
            console.error('❌ Failed to send email:', error.message);
            // Return error object instead of throwing, so we don't crash main flow
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmailService();
