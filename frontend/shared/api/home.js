let logout = document.getElementById("logout");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    // belum login, tendang balik ke halaman login
    window.location.href = "../auth/login.html";
}

function logoutFunction() {
    localStorage.removeItem("currentUser");
    window.location.href = "../auth/login.html";
}

logout.addEventListener("click",()=>{
    console.log("logkot")
    logoutFunction()
})