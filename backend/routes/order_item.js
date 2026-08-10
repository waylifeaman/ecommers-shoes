const express = require('express');
const route = express.Router();
const connection=require('../dbconnect');
//GET DATA
route.get('/', (req, res)=>{
    connection.query('SELECT * FROM order_items', (err, result)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json(result);
    })
})
// INNPUT DATA
route.post('/',(req, res)=>{
    const{order_id, product_id, size, qty} = req.body
    connection.query('INSERT INTO order_items(order_id, product_id, size, qty) VALUES (?, ?, ?, ?)', [order_id, product_id, size, qty],(err, result)=>{
        if (err) return res.status(500).json({ error: err.message });  
        res.json({id: result.insertId, order_id, product_id, size, qty});
    })
})

// EDITE DATA
route.put('/:id',(req, res)=>{
    const{order_id, product_id, size, qty} = req.body;
    connection.query('UPDATE order_items SET order_id = ?, product_id = ?, size = ?, qty = ? WHERE id = ?',[order_id, product_id, size, qty, req.params.id], (err)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json({id: req.params.id, order_id, product_id, size, qty}); 
    })
})

//DELETE DATA
route.delete('/:id',(req, res)=>{
    connection.query('DELETE FROM order_items WHERE id = ?', [req.params.id], (err)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json({message: 'DELETE DATA BERHASIL'}); 
    })
})
module.exports = route;