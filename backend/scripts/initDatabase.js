const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Initialize Database Schema for MySQL
 * Modified to create the database if it doesn't exist by connecting without a DB first
 */
async function initializeDatabase() {
  let connection;
  try {
    console.log('🚀 Starting MySQL database initialization...\n');

    // 1. First connect without a specific database to ensure we can create it
    const initPool = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'charity_db';
    console.log(`📋 Ensuring database "${dbName}" exists...`);
    await initPool.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await initPool.query(`USE ${dbName}`);

    // Use this connection for schema creation
    connection = initPool;

    // ==========================================
    // 1. ADMINS TABLE
    // ==========================================
    console.log('📋 Creating admins table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
      )
    `);

    // ==========================================
    // 2. HOME PAGE CONTENT TABLE
    // ==========================================
    console.log('📋 Creating home_content table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS home_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hero_title VARCHAR(255) NOT NULL,
        hero_tagline TEXT,
        hero_image VARCHAR(255),
        people_helped INT DEFAULT 0,
        events_done INT DEFAULT 0,
        volunteers INT DEFAULT 0,
        communities_served INT DEFAULT 0,
        intro_title VARCHAR(255),
        intro_text TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // ==========================================
    // 3. CAUSES TABLE
    // ==========================================
    console.log('📋 Creating causes table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS causes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        icon VARCHAR(100),
        short_description TEXT,
        full_description TEXT,
        image VARCHAR(255),
        features JSON,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // ==========================================
    // 4. GALLERY TABLE
    // ==========================================
    console.log('📋 Creating gallery table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image VARCHAR(255) NOT NULL,
        caption TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ==========================================
    // 5. DONATIONS TABLE
    // ==========================================
    console.log('📋 Creating donations table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        donor_name VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        cause VARCHAR(255),
        email VARCHAR(100),
        phone VARCHAR(20),
        message TEXT,
        donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'received',
        payment_method VARCHAR(50),
        transaction_id VARCHAR(100)
      )
    `);

    // ==========================================
    // 6. POSTS/UPDATES TABLE
    // ==========================================
    console.log('📋 Creating posts table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image VARCHAR(255),
        author_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES admins(id) ON DELETE SET NULL
      )
    `);

    // ==========================================
    // 7. SITE SETTINGS TABLE
    // ==========================================
    console.log('📋 Creating site_settings table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        site_name VARCHAR(255),
        tagline VARCHAR(255),
        telegram_bot_token VARCHAR(255),
        telegram_chat_id VARCHAR(255),
        contact_email VARCHAR(100),
        contact_phone VARCHAR(20),
        contact_address TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // ==========================================
    // 8. CONTACT MESSAGES TABLE
    // ==========================================
    console.log('📋 Creating contacts table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(100),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ==========================================
    // INSERT DEFAULT DATA
    // ==========================================
    const bcrypt = require('bcrypt');

    // Check if admin exists
    const [admins] = await connection.query('SELECT * FROM admins LIMIT 1');
    if (admins.length === 0) {
      console.log('👤 Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.query(
        'INSERT INTO admins (username, password_hash, email) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 'admin@hopefoundation.org']
      );
      console.log('✅ Default admin created (username: admin, password: admin123)\n');
    }

    // Check if home content exists
    const [home] = await connection.query('SELECT * FROM home_content LIMIT 1');
    if (home.length === 0) {
      console.log('🏠 Creating default home content...');
      await connection.query(`
        INSERT INTO home_content (
          hero_title, hero_tagline, hero_image, 
          people_helped, events_done, volunteers, communities_served,
          intro_title, intro_text
        ) VALUES (
          'Transforming Lives, One Step at a Time',
          'Together, we can bring hope, education, and nourishment to those who need it most',
          'images/hero-image.jpg',
          15000, 250, 500, 45,
          'Building a Better Tomorrow',
          'Hope Foundation is a non-profit organization dedicated to empowering underprivileged communities through education, nutrition, and healthcare. Since our inception, we have been committed to creating lasting change and breaking the cycle of poverty.'
        )
      `);
      console.log('✅ Default home content created\n');
    }

    // Check if site settings exist
    const [settings] = await connection.query('SELECT * FROM site_settings LIMIT 1');
    if (settings.length === 0) {
      console.log('⚙️ Creating default site settings...');
      await connection.query(`
        INSERT INTO site_settings (
          site_name, tagline, contact_email, contact_phone, contact_address
        ) VALUES (
          'Hope Foundation',
          'Transforming Lives Together',
          'info@hopefoundation.org',
          '+1 (555) 123-4567',
          '123 Hope Street, City, State'
        )
      `);
      console.log('✅ Default site settings created\n');
    }

    console.log('🎉 MySQL Database initialization completed successfully!\n');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

// Run script
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { initializeDatabase };
