class appFooter extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
         <footer>
        <div class="conten-footer">
            <div class="foot">
                <ul>
                    <li>
                        <h2>Sepatu</h2>
                    </li>
                    <li>Terlaris</li>
                    <li>Terbaru</li>
                    <li>Pilihan Terbaik</li>
                </ul>
            </div>
            <div class="foot">
                <ul>
                    <li>
                        <h2>Baju</h2>
                    </li>
                    <li>Terlaris</li>
                    <li>Terbaru</li>
                    <li>Pilihan Terbaik</li>
                </ul>
            </div>
            <div class="foot">
                <ul>
                    <li>
                        <h2>Celana</h2>
                    </li>
                    <li>Terlaris</li>
                    <li>Terbaru</li>
                    <li>Pilihan Terbaik</li>
                </ul>
            </div>
            <div class="foot">
                <ul>
                    <li>
                        <h2>Jaket</h2>
                    </li>
                    <li>Terlaris</li>
                    <li>Terbaru</li>
                    <li>Pilihan Terbaik</li>
                </ul>
            </div>
        </div>
        <div class="copyright">
            <p>amanahcyad&copy;Copyright 2026</p>
        </div>
   </footer>
        
        `
    };
}

customElements.define("app-footer", appFooter);