let name = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let btnregister = document.getElementById("btn-register");
let btnlogin = document.getElementById("btn-login");

function emailvalidasi(data) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(data.email);
}

function passwordvalidasi(data) {
  let password = data.password;
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

function validasiData(data) {
  if (data.name === "" || data.email === "" || data.password === "") {
    console.log("Data Belum Terisi");
    return false;
  } else {
    console.log("Data sudah di isi");
    if (emailvalidasi(data) === false || passwordvalidasi(data) === false) {
      return false;
    }
    return true;
  }
}

async function addUsers(data) {
    const res = await fetch("http://localhost:3000/data-users",{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(data)
    });
    if(!res.ok){
        const error = await res.json();
        console.log("Registrai Gagal", error.error);
        return;
    }
    const result = await res.json();
    console.log("Daftar berhasil", result);

}

async function loginUser(data) {
    const res = await fetch("http://localhost:3000/data-users/login", {
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(data)
    });
    if(!res.ok){
        const error = await res.json();
        console.log("login Gagal", error.error);
        return
    }
    const result = await res.json();
    window.location.href = "../home/main.html";
    console.log("Login Behasil", result)
}

if(btnregister){
    btnregister.addEventListener("click",()=>{
        let data = {
            name: name.value,
            email: email.value,
            password: password.value,
            role:"customer"
        }
        if(!validasiData(data) || !emailvalidasi(data) || !passwordvalidasi(data)){
            // console.log("data tidak valid");
            return;
        }
        addUsers(data);
    })
}

if(btnlogin){
    btnlogin.addEventListener("click",()=>{
        let data = {
            email: email.value,
            password: password.value
        }
        if(!emailvalidasi(data)){
            console.log("Masukkan Email dan Password yang terdaftar");
            return;        
            }
        loginUser(data);
    });

 }