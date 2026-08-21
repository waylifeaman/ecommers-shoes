const express = require('express');
const route = express.Router();
const connection = require('../dbconnect');

//GET DATA PRODUK
route.get('/',(req, res)=>{
    connection.query('SELECT * FROM categories', (err, result)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json(result);
    })
})


//POST DATA
route.post('/', (req, res)=>{
    const{name} = req.body;
    if(!name){
       return res.status(400).json({ error: 'Data belum lengkap' });   
        
    }
    connection.query('INSERT INTO categories (name) VALUES (?)', [name], (err, result)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json({id: result.insertId, name});
    })
})

//EDIT DATA PRODUK
route.put('/:id', (req, res)=>{
    const{name} = req.body;
    connection.query(
        'UPDATE categories SET name = ? WHERE id = ?', [name, req.params.id],(err)=>{
            if(err) return res.status(500).json({error: err.message});
            res.json({id: req.params.id, name});
        }); 
})

//DELETE  PRODUK
route.delete('/:id', (req, res)=>{
    connection.query('DELETE FROM categories WHERE id = ?', [req.params.id], (err)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json({message: 'DELETE DATA BERHASIL'}); 
    })
})



module.exports = route;