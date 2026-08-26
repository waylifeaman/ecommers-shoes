const express = require('express');
const route = express.Router();
const connection=require('../dbconnect');
//GET DATA
route.get('/', (req, res)=>{
    connection.query('SELECT * FROM orders', (err, result)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json(result);
    })
})
// INNPUT DATA
route.post('/',(req, res)=>{
    const{user_id, total, status} = req.body
    connection.query('INSERT INTO orders(user_id, total, status) VALUES (?, ?, ?)', [user_id, total, status],(err, result)=>{
        if (err) return res.status(500).json({ error: err.message });  
        res.json({id: result.insertId, user_id, total, status});
    })
})

// EDITE DATA
route.put('/:id',(req, res)=>{
    const{user_id, total, status} = req.body;
    connection.query('UPDATE orders SET user_id = ?, total = ?, status = ? WHERE id = ?',[user_id, total, status, req.params.id], (err)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json({id: req.params.id, user_id, total, status}); 
    })
})

//DELETE DATA
route.delete('/:id',(req, res)=>{
    connection.query('DELETE FROM orders WHERE id = ?', [req.params.id], (err)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json({message: 'DELETE DATA BERHASIL'}); 
    })
})


// Post jika user cekout
route.post('/checkout', (req, res) => {
    const { user_id, cart_ids } = req.body; 
    // cart_ids = array of cart.id yang dicentang, misal [1, 3, 5]

    if (!cart_ids || cart_ids.length === 0) {
        return res.status(400).json({ error: "Tidak ada item yang dipilih" });
    }

    connection.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: err.message });

        // 1. Ambil detail item yang dipilih (join carts + products biar dapat harga)
        const placeholders = cart_ids.map(() => '?').join(',');
        const getItemsQuery = `
            SELECT carts.id AS cart_id, carts.product_id, carts.size, carts.qty, products.price
            FROM carts
            JOIN products ON carts.product_id = products.id
            WHERE carts.id IN (${placeholders}) AND carts.user_id = ?
        `;

        connection.query(getItemsQuery, [...cart_ids, user_id], (err, items) => {
            if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

            if (items.length === 0) {
                return connection.rollback(() => res.status(404).json({ error: "Item tidak ditemukan" }));
            }

            // 2. Hitung total harga
            const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

            // 3. INSERT ke orders
            const insertOrderQuery = `INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'pending')`;

            connection.query(insertOrderQuery, [user_id, total], (err, orderResult) => {
                if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

                const orderId = orderResult.insertId;

                // 4. INSERT ke order_items (satu-satu untuk tiap item)
                const orderItemsValues = items.map(item => [
                    orderId, item.product_id, item.size, item.qty, item.price
                ]);

                const insertItemsQuery = `
                    INSERT INTO order_items (order_id, product_id, size, qty, price) VALUES ?
                `;

                connection.query(insertItemsQuery, [orderItemsValues], (err) => {
                    if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

                    // 5. Kurangi stok di product_sizes untuk tiap item
                    let stokUpdateCount = 0;
                    let stokError = false;

                    items.forEach((item) => {
                        const updateStokQuery = `
                            UPDATE product_sizes 
                            SET stok = stok - ? 
                            WHERE product_id = ? AND size = ? AND stok >= ?
                        `;

                        connection.query(updateStokQuery, [item.qty, item.product_id, item.size, item.qty], (err, result) => {
                            if (err || result.affectedRows === 0) {
                                stokError = true;
                            }

                            stokUpdateCount++;

                            // setelah semua item diproses
                            if (stokUpdateCount === items.length) {
                                if (stokError) {
                                    return connection.rollback(() => 
                                        res.status(400).json({ error: "Stok tidak mencukupi untuk salah satu item" })
                                    );
                                }

                                // 6. Hapus item dari carts
                                const deleteCartQuery = `DELETE FROM carts WHERE id IN (${placeholders})`;

                                connection.query(deleteCartQuery, cart_ids, (err) => {
                                    if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

                                    // SEMUA SUKSES -> commit
                                    connection.commit((err) => {
                                        if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

                                        res.status(201).json({ 
                                            message: "Checkout berhasil", 
                                            order_id: orderId, 
                                            total 
                                        });
                                    });
                                });
                            }
                        });
                    });
                });
            });
        });
    });
});

// Get data order by id user
route.get('/:order_id', (req, res) => {
    const { order_id } = req.params;

    // 1. ambil data order-nya sendiri
    const orderQuery = `SELECT * FROM orders WHERE id = ?`;

    connection.query(orderQuery, [order_id], (err, orderResult) => {
        if (err) return res.status(500).json({ error: err.message });

        if (orderResult.length === 0) {
            return res.status(404).json({ message: "Order tidak ditemukan" });
        }

        const order = orderResult[0];

        // 2. ambil semua item di order ini, JOIN ke products biar dapat nama & gambar
        const itemsQuery = `
            SELECT 
                order_items.id AS order_item_id,
                order_items.product_id,
                order_items.size,
                order_items.qty,
                order_items.price,
                products.name,
                products.image
            FROM order_items
            JOIN products ON order_items.product_id = products.id
            WHERE order_items.order_id = ?
        `;

        connection.query(itemsQuery, [order_id], (err, items) => {
            if (err) return res.status(500).json({ error: err.message });

            // 3. gabungkan jadi 1 response
            res.json({
                ...order,
                items: items
            });
        });
    });
});

module.exports = route;