const mysql = require('mysql2');

const connecting = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'e_commers_sepatu',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 5,
});

connecting.getConnection((err, conn) => {
    if (err) {
        console.log("Gagal Terhubung ke Database:", err.message);
        return;
    }
    console.log("Berhasil Terhubung Ke Database");
    conn.release();
});

module.exports = connecting;