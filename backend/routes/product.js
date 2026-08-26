const express = require('express');
const route = express.Router();
const connection = require('../dbconnect');

//GET DATA PRODUK
route.get('/', (req, res) => {
    const showAll = req.query.all === 'true';  
    const sql = showAll 
        ? 'SELECT * FROM products' 
        : 'SELECT * FROM products WHERE is_active = TRUE';

    connection.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});


//POST DATA
route.post('/', (req, res)=>{
    const{name, brand, price, description, image, category_id} = req.body;
    connection.query('INSERT INTO products(name, brand, price, description, image, category_id) VALUES (?, ?, ?, ?, ?, ?)', [name, brand, price, description, image, category_id], (err, result)=>{
        if(!name || !brand || !price || !description || !image || !category_id ){
                return res.status(400).json({ error: 'Data belum lengkap' });   
        }

        if(err) return res.status(500).json({error: err.message});
        res.json({id: result.insertId, name, brand, price, description, image, category_id});
    })
})

//EDIT DATA PRODUK
route.put('/:id', (req, res)=>{
    const{name, brand, price, description, image, category_id} = req.body;
    connection.query(
        
        'UPDATE products SET name = ?, brand = ?, price = ?, description = ?, image = ?, category_id = ? WHERE id = ?', [name, brand, price, description, image, category_id, req.params.id],(err)=>{
            if(!name || !brand || !price || !description || !image || !category_id ){
            return res.status(400).json({ error: 'Data belum lengkap' });   
        }
            if(err) return res.status(500).json({error: err.message});
            res.json({id: req.params.id, name, brand, price, description, image, category_id});
        }); 
})

//DELETE  PRODUK
route.delete('/:id', (req, res) => {
    connection.query(
        'UPDATE products SET is_active = FALSE WHERE id = ?', 
        [req.params.id], 
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Produk tidak ditemukan' });
            }
            res.json({ message: 'Produk berhasil dinonaktifkan' });
        }
    );
});

route.put('/:id/activate', (req, res) => {
    connection.query(
        'UPDATE products SET is_active = TRUE WHERE id = ?', 
        [req.params.id], 
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Produk berhasil diaktifkan kembali' });
        }
    );
});

// AMBil Data Produk by ID
route.get('/:id', (req, res)=>{
      const { id } = req.params;
    const query='SELECT * FROM products WHERE id = ?';
    connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.status(200).json(results[0]); // kirim 1 object produk
  });
})
module.exports = route;