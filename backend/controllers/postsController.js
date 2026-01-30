const { query } = require('../config/database');

/**
 * Posts / Updates Controller (MySQL)
 */
class PostsController {
    async getAllPosts(req, res) {
        try {
            const result = await query(
                'SELECT p.*, a.username as author_name FROM posts p LEFT JOIN admins a ON p.author_id = a.id ORDER BY p.created_at DESC'
            );
            res.json({ success: true, data: result.rows });
        } catch (error) {
            console.error('Get posts error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch posts' });
        }
    }

    async getPostById(req, res) {
        try {
            const { id } = req.params;
            const result = await query(
                'SELECT p.*, a.username as author_name FROM posts p LEFT JOIN admins a ON p.author_id = a.id WHERE p.id = ?',
                [id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }
            res.json({ success: true, data: result.rows[0] });
        } catch (error) {
            console.error('Get post error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch post' });
        }
    }

    async createPost(req, res) {
        try {
            const { title, content, image } = req.body;
            const authorId = req.admin.id;
            await query('INSERT INTO posts (title, content, image, author_id) VALUES (?, ?, ?, ?)', [title, content, image, authorId]);
            res.status(201).json({ success: true, message: 'Post created successfully' });
        } catch (error) {
            console.error('Create post error:', error);
            res.status(500).json({ success: false, message: 'Failed to create post' });
        }
    }

    async updatePost(req, res) {
        try {
            const { id } = req.params;
            const { title, content, image } = req.body;
            const result = await query(
                'UPDATE posts SET title = ?, content = ?, image = ? WHERE id = ?',
                [title, content, image, id]
            );
            if (result.rowCount === 0) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }
            res.json({ success: true, message: 'Post updated successfully' });
        } catch (error) {
            console.error('Update post error:', error);
            res.status(500).json({ success: false, message: 'Failed to update post' });
        }
    }

    async deletePost(req, res) {
        try {
            const { id } = req.params;
            const result = await query('DELETE FROM posts WHERE id = ?', [id]);
            if (result.rowCount === 0) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }
            res.json({ success: true, message: 'Post deleted successfully' });
        } catch (error) {
            console.error('Delete post error:', error);
            res.status(500).json({ success: false, message: 'Failed to delete post' });
        }
    }
}

module.exports = new PostsController();
