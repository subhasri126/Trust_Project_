const { query } = require('../config/database');

/**
 * Causes Controller (MySQL)
 */
class CausesController {
    async getAllCauses(req, res) {
        try {
            const result = await query('SELECT * FROM causes WHERE active = true ORDER BY created_at DESC');
            res.json({ success: true, data: result.rows });
        } catch (error) {
            console.error('Get causes error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch causes' });
        }
    }

    async getAllCausesAdmin(req, res) {
        try {
            const result = await query('SELECT * FROM causes ORDER BY created_at DESC');
            res.json({ success: true, data: result.rows });
        } catch (error) {
            console.error('Get admin causes error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch causes' });
        }
    }

    async getCauseById(req, res) {
        try {
            const { id } = req.params;
            const result = await query('SELECT * FROM causes WHERE id = ?', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Cause not found' });
            }
            res.json({ success: true, data: result.rows[0] });
        } catch (error) {
            console.error('Get cause error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch cause' });
        }
    }

    async createCause(req, res) {
        try {
            const { title, icon, short_description, full_description, image, features } = req.body;
            const result = await query(
                `INSERT INTO causes (title, icon, short_description, full_description, image, features) 
         VALUES (?, ?, ?, ?, ?, ?)`,
                [title, icon, short_description, full_description, image, JSON.stringify(features)]
            );
            res.status(201).json({ success: true, message: 'Cause created successfully' });
        } catch (error) {
            console.error('Create cause error:', error);
            res.status(500).json({ success: false, message: 'Failed to create cause' });
        }
    }

    async updateCause(req, res) {
        try {
            const { id } = req.params;
            const { title, icon, short_description, full_description, image, features, active } = req.body;
            const result = await query(
                `UPDATE causes SET title = ?, icon = ?, short_description = ?, full_description = ?, image = ?, features = ?, active = ? 
         WHERE id = ?`,
                [title, icon, short_description, full_description, image, JSON.stringify(features), active, id]
            );
            if (result.rowCount === 0) {
                return res.status(404).json({ success: false, message: 'Cause not found' });
            }
            res.json({ success: true, message: 'Cause updated successfully' });
        } catch (error) {
            console.error('Update cause error:', error);
            res.status(500).json({ success: false, message: 'Failed to update cause' });
        }
    }

    async deleteCause(req, res) {
        try {
            const { id } = req.params;
            const result = await query('DELETE FROM causes WHERE id = ?', [id]);
            if (result.rowCount === 0) {
                return res.status(404).json({ success: false, message: 'Cause not found' });
            }
            res.json({ success: true, message: 'Cause deleted successfully' });
        } catch (error) {
            console.error('Delete cause error:', error);
            res.status(500).json({ success: false, message: 'Failed to delete cause' });
        }
    }

    async toggleCauseStatus(req, res) {
        try {
            const { id } = req.params;
            await query('UPDATE causes SET active = NOT active WHERE id = ?', [id]);
            res.json({ success: true, message: 'Cause status toggled successfully' });
        } catch (error) {
            console.error('Toggle cause status error:', error);
            res.status(500).json({ success: false, message: 'Failed to toggle cause status' });
        }
    }
}

module.exports = new CausesController();
