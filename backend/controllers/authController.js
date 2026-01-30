const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

/**
 * Admin Authentication Controller (MySQL)
 */
class AuthController {
    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Find admin by username
            const result = await query(
                'SELECT * FROM admins WHERE username = ?',
                [username]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const admin = result.rows[0];
            const isValidPassword = await bcrypt.compare(password, admin.password_hash);

            if (!isValidPassword) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            await query(
                'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                [admin.id]
            );

            const token = jwt.sign(
                { id: admin.id, username: admin.username },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    admin: { id: admin.id, username: admin.username, email: admin.email }
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, message: 'Login failed' });
        }
    }

    async verifyToken(req, res) {
        try {
            const result = await query(
                'SELECT id, username, email FROM admins WHERE id = ?',
                [req.admin.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Admin not found' });
            }

            res.json({ success: true, data: { admin: result.rows[0] } });
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(500).json({ success: false, message: 'Verification failed' });
        }
    }

    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const adminId = req.admin.id;

            const result = await query('SELECT * FROM admins WHERE id = ?', [adminId]);
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Admin not found' });
            }

            const admin = result.rows[0];
            const isValidPassword = await bcrypt.compare(currentPassword, admin.password_hash);

            if (!isValidPassword) {
                return res.status(401).json({ success: false, message: 'Current password is incorrect' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await query('UPDATE admins SET password_hash = ? WHERE id = ?', [hashedPassword, adminId]);

            res.json({ success: true, message: 'Password changed successfully' });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ success: false, message: 'Failed to change password' });
        }
    }
}

module.exports = new AuthController();
