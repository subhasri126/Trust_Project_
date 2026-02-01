const { query, pool } = require('./config/database');

async function testInsert() {
    try {
        console.log('Testing insert...');
        const donor_name = "Debug User";
        const amount = 50;
        const email = "debug@test.com";
        const phone = "1234567890";
        const message = "Debug message";
        const payment_method = "Online";
        const transaction_id = "TXN_DEBUG_123";

        const result = await query(
            `INSERT INTO donations (donor_name, amount, email, phone, message, payment_method, transaction_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [donor_name, amount, email, phone, message, payment_method, transaction_id]
        );

        console.log('Insert successful!');
        console.log('Result:', result);
    } catch (error) {
        console.error('Insert failed:', error);
    } finally {
        await pool.end();
    }
}

testInsert();
