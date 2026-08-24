
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
                        <img src="../../assets/icons/cart.png" alt="">
                </div>
            </div>
        </div>
    </header>
  `;
  }}  
customElements.define("app-header", AppHeader);

