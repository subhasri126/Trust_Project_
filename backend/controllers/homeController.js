const { query } = require('../config/database');

/**
 * Home Page Content Controller (MySQL)
 */
class HomeController {
    async getHomeContent(req, res) {
        try {
            const result = await query('SELECT * FROM home_content ORDER BY id DESC LIMIT 1');

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Home content not found' });
            }

            res.json({ success: true, data: result.rows[0] });
        } catch (error) {
            console.error('Get home content error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch home content' });
        }
    }

    async updateHomeContent(req, res) {
        try {
            const {
                hero_title, hero_tagline, hero_image,
                people_helped, events_done, volunteers, communities_served,
                intro_title, intro_text
            } = req.body;

            const checkResult = await query('SELECT id FROM home_content LIMIT 1');

            let result;
            if (checkResult.rows.length === 0) {
                result = await query(
                    `INSERT INTO home_content (
            hero_title, hero_tagline, hero_image,
            people_helped, events_done, volunteers, communities_served,
            intro_title, intro_text
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        hero_title, hero_tagline, hero_image,
                        people_helped, events_done, volunteers, communities_served,
                        intro_title, intro_text
                    ]
                );
            } else {
                result = await query(
                    `UPDATE home_content SET
            hero_title = ?, hero_tagline = ?, hero_image = ?,
            people_helped = ?, events_done = ?, volunteers = ?, communities_served = ?,
            intro_title = ?, intro_text = ?
          WHERE id = ?`,
                    [
                        hero_title, hero_tagline, hero_image,
                        people_helped, events_done, volunteers, communities_served,
                        intro_title, intro_text,
                        checkResult.rows[0].id
                    ]
                );
            }

            res.json({ success: true, message: 'Home content updated successfully' });
        } catch (error) {
            console.error('Update home content error:', error);
            res.status(500).json({ success: false, message: 'Failed to update home content' });
        }
    }
}

module.exports = new HomeController();
