const mysql = require('mysql2');
const connecting = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'e_commers_sepatu',
})

connecting.connect((err)=>{
    if(err){
       console.log("Gagal Terhubung ke Database");
       return; 
    }else{
        console.log("Berhasil Terhubung Ke Database");
    }
});

module.exports = connecting;