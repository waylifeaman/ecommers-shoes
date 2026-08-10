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
route.post('/',(req, res)=>{
    const{user_id, product_id, size, qty} = req.body
    connection.query('INSERT INTO carts(user_id, product_id, size, qty) VALUES (?, ?, ?, ?)', [user_id, product_id, size, qty],(err, result)=>{
        if (err) return res.status(500).json({ error: err.message });  
        res.json({id: result.insertId, user_id, product_id, size, qty});
    })
})

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
module.exports = route;