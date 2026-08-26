
class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header>
        <div class="header">
            <div class="col-1">
                <div class="logo">
                    <h1>Sultan</h1>
                </div>
            </div>    
            <div class="col-3">
                <div class="navbar">
                    <nav>
                        <ul>
                            <li><a href="../../features/home/main.html">Home</a></li>
                            <li><a href="../../features/home/product.html">Produk</a></li>
                            
                        </ul>
                    </nav>
                </div>
            </div>
            <div class="col-2">
                <div class="cart">
                                    
                        <input type="text" placeholder="Cari Produk...">
                        <img src="../../assets/icons/person.png" alt="" class="icon-person">  
                        <img src="../../assets/icons/cart.png" alt="" class= "icon-cart">
                </div>
            </div>
        </div>
    </header>
  `;

    const cart = document.querySelector(".icon-cart");
    
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    cart.addEventListener('click', () => {
        if (!currentUser) {
            alert("Silakan login dulu");
            return;
        }
        window.location.href = `../../features/home/cart.html`;
    });


  }}  
customElements.define("app-header", AppHeader);

