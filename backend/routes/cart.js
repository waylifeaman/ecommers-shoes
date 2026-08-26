const express = require('express');
const route = express.Router();
const connection=require('../dbconnect');
//GET DATA
route.get('/', (req, res)=>{
    connection.query('SELECT * FROM carts', (err, result)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json(result);
    })
})
// INNPUT DATA
route.post('/', (req, res) => {
    const { user_id, product_id, size, qty } = req.body;

    // 1. cek dulu apakah kombinasi user_id + product_id + size sudah ada
    const checkQuery = 'SELECT * FROM carts WHERE user_id = ? AND product_id = ? AND size = ?';

    connection.query(checkQuery, [user_id, product_id, size], (err, existing) => {
        if (err) return res.status(500).json({ error: err.message });

        if (existing.length > 0) {
            // 2a. SUDAH ADA -> update qty (tambahkan qty baru ke qty lama)
            const cartId = existing[0].id;
            const newQty = existing[0].qty + qty;

            const updateQuery = 'UPDATE carts SET qty = ? WHERE id = ?';
            connection.query(updateQuery, [newQty, cartId], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ id: cartId, user_id, product_id, size, qty: newQty, updated: true });
            });

        } else {
            // 2b. BELUM ADA -> insert baris baru seperti biasa
            const insertQuery = 'INSERT INTO carts(user_id, product_id, size, qty) VALUES (?, ?, ?, ?)';
            connection.query(insertQuery, [user_id, product_id, size, qty], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ id: result.insertId, user_id, product_id, size, qty, updated: false });
            });
        }
    });
});

// EDITE DATA
route.put('/:id',(req, res)=>{
    const{user_id, product_id, size, qty} = req.body;
    connection.query('UPDATE carts SET user_id = ?, product_id = ?, size =?, qty = ? WHERE id = ?',[user_id, product_id, size, qty, req.params.id], (err)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json({id: req.params.id, user_id, product_id, size, qty}); 
    })
})

//DELETE DATA
route.delete('/:id',(req, res)=>{
    connection.query('DELETE FROM carts WHERE id = ?', [req.params.id], (err)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json({message: 'DELETE DATA BERHASIL'}); 
    })
})

// Ambil data berdaasarkan ID USer
route.get('/user/:user_id', (req, res) => {
    const { user_id } = req.params;

    const query = `
        SELECT 
            carts.id AS cart_id,
            carts.size,
            carts.qty,
            carts.created_at,
            products.id AS product_id,
            products.name,
            products.price,
            products.image,
            products.description
        FROM carts
        JOIN products ON carts.product_id = products.id
        WHERE carts.user_id = ?
    `;

    connection.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
module.exports = route;