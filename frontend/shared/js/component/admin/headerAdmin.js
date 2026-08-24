
class AppAdminHeader extends HTMLElement {
  connectedCallback() {
    const pageTitle = this.getAttribute("title") || "Dashboard Admin";
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.innerHTML = `
   <header>
        <div class="header">
            <div class="col-1">
                <div class="judul">
                    <h2>${pageTitle}</h2>
                </div>
                <div class="deskripsi">
                    <p>Monitoring, Manajeman, Sultan Shoes</p>
                </div>
            </div>
            <div class="col-2"></div>
            <div class="col-3">
                <div class="jumlah">
                    <p>Selamat Datang</p>
                    <h3>${currentUser.name}</h3>
                </div>
                <div class="dropdown">
                    <button onclick="myFunction()" class="dropbtn">Setting</button>
                    <div id="myDropdown" class="dropdown-content">
                        <a href="" id="route-home">Home</a>
                        <a href="" id="route-profile">Profile</a>
                        <a href="" id="route-category">Category</a>                        
                        <a href="" id= "route-size">Order</a>
                        <a href="" id="log-out">Log-Out</a>
                    </div>
                </div>             
            </div>
        </div>
    </header>`;
    const routeCategory = this.querySelector("#route-category");
    routeCategory.addEventListener("click", (e) => {
      e.preventDefault(); 
      window.location.href = "../../features/admin/category.html"; 
    });
    const routeHome = this.querySelector("#route-home")
    routeHome.addEventListener("click",(e)=>{
        e.preventDefault();
        window.location.href = "../../features/admin/admin.html";
    })

    const routeSizeProduk = this.querySelector("#route-size");
    routeSizeProduk.addEventListener("click",(e)=>{
        e.preventDefault();
        window.location.href = "../../features/admin/produkSize.html"
    })

    const logOut = this.querySelector("#log-out");
    logOut.addEventListener('click',()=>{
        let konfirm = confirm('Yakin mau  log-out ?')
        if(!konfirm)return;
        logoutFunction();        
        
        return confirm;
    })
    function logoutFunction() {
        localStorage.removeItem("currentUser");
        window.location.href = "../auth/login.html";
    }

  }
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

customElements.define("app-admin-header", AppAdminHeader);