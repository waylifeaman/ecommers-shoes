const express = require('express');
const route = express.Router();
const connection=require('../dbconnect');
const bcrypt = require('bcrypt');



//GET DATA
route.get('/', (req, res)=>{
    connection.query('SELECT * FROM users', (err, result)=>{
        if(err) return res.status(500).json({error: err.message});
        res.json(result);
    })
})
// INNPUT DATA
function validasiEmail(email){
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validasiPassword(password){
    let hurufKapital = /[A-Z]/;
    let hurufKecil = /[a-z]/;
    let angka = /[0-9]/;
    let tandabaca = /[!@#$%^&*]/;

    
  if (
    hurufKapital.test(password) &&
    hurufKecil.test(password) &&
    angka.test(password) &&
    tandabaca.test(password) &&
    password.length >= 6
  ) {
    console.log("password valid" + " " + password);
    return true;
  } else {
    console.log(
      "password harus huruf besar minimal 1 minimal 6 karakter dan ada tanda . )" +
        password,
    );

    return false;
  }
}


route.post('/', async(req, res)=>{
    const{name, email, password, role} = req.body;
    ///validasi data kosong
    if(
        !name || !email || !password || !role
    ){
        return res.status(400).json({ error: 'Data belum lengkap' });
    }
   //Validasi Email
    if (!validasiEmail(email)) {
        return res.status(400).json({ error: 'Format email tidak valid' });
    }
    //Validasi Password
    if(!validasiPassword(password)){
        return res.status(400).json({ error: 'Password Tidak valid' });
    }
    //Hash ing Password
    try{
        const passwordHash = await bcrypt.hash(password, 10);
        connection.query('INSERT INTO users(name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, passwordHash, role],(err, result)=>{
        if (err) return res.status(500).json({ error: err.message });  
        res.json({id: result.insertId, name, email, role});
    })
        }catch(err){
            console.log(err);
            return res.status(500).json({error: 'Gagal hash password'});
        }
  
})

// EDITE DATA
route.put('/:id',(req, res)=>{
    const{name, email, password, role} = req.body;
    // Validasi field kosong
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Data belum lengkap' });
    }

    // Validasi Email
    if (!validasiEmail(email)) {
        return res.status(400).json({ error: 'Format email tidak valid' });
    }

    // Validasi Password
    if (!validasiPassword(password)) {
        return res.status(400).json({ error: 'Password tidak valid' });
    }

   connection.query('UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',[name, email, password, role, req.params.id], (err, result)=>{
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }
        res.json({id: req.params.id, name, email, password, role}); 
        })
})

//DELETE DATA
route.delete('/:id',(req, res)=>{
    connection.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result)=>{
        if (err) {
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({ error: 'User tidak bisa dihapus karena masih memiliki order/cart' });
            }
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }  
        res.json({message: 'DELETE DATA BERHASIL'}); 
    })
})



//ROUTE LOGIN
route.post('/login', (req, res)=>{
    const {email, password} = req.body;

    connection.query('SELECT * FROM users WHERE email = ?', [email], async(err, results)=>{
        if(err) return res.status(500).json({error: err.message});
        if(results.length === 0) return res.status(400).json({error: "User Tidak Ditemukan"});
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            res.json({message: 'Login Berhasil', user:{id: user.id, name: user.name, role: user.role}});
        }else{
            res.status(401).json({error: 'Password Salah'})
        }
    })
})












module.exports = route;