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
    showAlert(
      "password harus terdiri dari 6 karakter 1 huruf Kapital dan (#@!)" +
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


const endpointDataUser = "https://ecommers-shoes.vercel.app/data-users" 

async function addUsers(data) {
    const res = await fetch(endpointDataUser,{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(data)
    });
    if(!res.ok){
        const error = await res.json();
        showAlert(`Registrasi Gagal: ${error.error}`, "error");
        return;
    }else{
        const result = await res.json();
        showAlert("Daftar berhasil", "success",()=>{
            window.location.href="login.html";
        });
    }

}

async function loginUser(data) {
    const res = await fetch("https://ecommers-shoes.vercel.app/data-users/login", {
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(data)
    });
    if(!res.ok){
        const error = await res.json();
        showAlert(`login Gagal: ${error.error}`, "error");
        return
    }else{
        const result = await res.json();
        localStorage.setItem("currentUser", JSON.stringify(result.user));

        showAlert('Login Behasil', result,()=>{     
            if (result.user.role === "owner"){
                window.location.href = "../admin/admin.html"
            }else{   
                window.location.href = "../home/main.html";
            }
        });
    }
}

async function getDataUser() {
    const res = await fetch(endpointDataUser,{
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
    })
    if(!res.ok){
        throw new Error("Gagal Ambil Data User");
    }
    return await res.json();
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
            console.log("data tidak valid");
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
            alert("Masukkan Email dan Password yang terdaftar");
            return;        
            }
        loginUser(data);
    });

 }