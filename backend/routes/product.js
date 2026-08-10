const express = require('express');
const route = express.Router();
const connection = require('../dbconnect');

//GET DATA PRODUK
route.get('/',(req, res)=>{
    connection.query('SELECT * FROM products', (err, result)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json(result);
    })
})


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
route.delete('/:id', (req, res)=>{
    connection.query('DELETE FROM products WHERE id = ?', [req.params.id], (err)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json({message: 'DELETE DATA BERHASIL'}); 
    })
})

module.exports = route;