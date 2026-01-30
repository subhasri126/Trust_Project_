const { query } = require('../config/database');
const { deleteFile } = require('../config/upload');

/**
 * Gallery Controller (MySQL)
 */
class GalleryController {
    async getAllImages(req, res) {
        try {
            const result = await query('SELECT * FROM gallery ORDER BY created_at DESC');
            res.json({ success: true, data: result.rows });
        } catch (error) {
            console.error('Get gallery error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch gallery images' });
        }
    }

    async addImage(req, res) {
        try {
            const { image, caption } = req.body;
            if (!image) return res.status(400).json({ success: false, message: 'Image path is required' });

            await query('INSERT INTO gallery (image, caption) VALUES (?, ?)', [image, caption]);
            res.status(201).json({ success: true, message: 'Image added successfully' });
        } catch (error) {
            console.error('Add gallery image error:', error);
            res.status(500).json({ success: false, message: 'Failed to add image' });
        }
    }

    async deleteImage(req, res) {
        try {
            const { id } = req.params;
            const checkResult = await query('SELECT image FROM gallery WHERE id = ?', [id]);

            if (checkResult.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Image not found' });
            }

            const imagePath = checkResult.rows[0].image;
            await query('DELETE FROM gallery WHERE id = ?', [id]);

            if (imagePath && imagePath.startsWith('uploads/')) {
                const filename = imagePath.split('/').pop();
                deleteFile(filename);
            }

            res.json({ success: true, message: 'Image deleted successfully' });
        } catch (error) {
            console.error('Delete gallery image error:', error);
            res.status(500).json({ success: false, message: 'Failed to delete image' });
        }
    }
}

module.exports = new GalleryController();
