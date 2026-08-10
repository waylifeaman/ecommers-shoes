const express = require('express');
const route = express.Router();
const connection=require('../dbconnect');
//GET DATA
route.get('/', (req, res)=>{
    connection.query('SELECT * FROM product_sizes', (err, result)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json(result);
    })
})
// INNPUT DATA
route.post('/',(req, res)=>{
    const{product_id, size, stok} = req.body
    connection.query('INSERT INTO product_sizes(product_id, size, stok) VALUES (?, ?, ?)', [product_id, size, stok],(err, result)=>{
        if (err) return res.status(500).json({ error: err.message });  
        res.json({id: result.insertId, product_id, size, stok});
    })
})

// EDITE DATA
route.put('/:id',(req, res)=>{
    const{product_id, size, stok} = req.body;
    connection.query('UPDATE product_sizes SET product_id = ?, size =?, stok = ? WHERE id = ?',[product_id, size, stok, req.params.id], (err)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json({id: req.params.id, product_id, size, stok}); 
    })
})

//DELETE DATA
route.delete('/:id',(req, res)=>{
    connection.query('DELETE FROM product_sizes WHERE id = ?', [req.params.id], (err)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json({message: 'DELETE DATA BERHASIL'}); 
    })
})
module.exports = route;