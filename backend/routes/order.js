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
module.exports = route;