const express = require('express');
const route = express.Router();
const connection=require('../dbconnect');

// Helper: bungkus connection.query jadi Promise biar bisa pakai async/await
function query(sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

// GET stok semua ukuran untuk 1 produk
route.get('/', async (req, res) => {
    const productId = req.query.product_id;
    if (!productId) {
        return res.status(400).json({ error: 'product_id wajib diisi' });
    }

    try {
        const result = await query(
            'SELECT * FROM product_sizes WHERE product_id = ?',
            [productId]
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SIMPAN stok banyak ukuran sekaligus (bulk upsert)
route.put('/bulk', async (req, res) => {
    const { product_id, sizes } = req.body;
    // sizes contoh: [{ size: 36, stok: 5 }, { size: 37, stok: 0 }, ...]

    if (!product_id || !Array.isArray(sizes)) {
        return res.status(400).json({ error: 'Data tidak valid' });
    }

    try {
        for (const item of sizes) {
            const existing = await query(
                'SELECT id FROM product_sizes WHERE product_id = ? AND size = ?',
                [product_id, item.size]
            );
              console.log(`Size ${item.size} - existing:`, existing);
            if (existing.length > 0) {
                // sudah ada -> update
                await query(
                    'UPDATE product_sizes SET stok = ? WHERE product_id = ? AND size = ?',
                    [item.stok, product_id, item.size]
                );
            } else {
                // belum ada -> insert
                await query(
                    'INSERT INTO product_sizes (product_id, size, stok) VALUES (?, ?, ?)',
                    [product_id, item.size, item.stok]
                );
            }
        }

        res.json({ message: 'Stok berhasil disimpan' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Size By Produk_id
route.get('/product/:product_id', (req, res)=>{
    const { product_id } = req.params;
    const query = 'SELECT * FROM product_sizes WHERE product_id = ?';
    

    connection.query(query, [product_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Server error", error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Size tidak ditemukan untuk produk ini" });
        }

        res.status(200).json(results); // array, karena bisa lebih dari 1 size
    });
})

module.exports = route;