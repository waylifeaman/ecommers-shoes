const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));


function renderProduct(product){
    const detailProduk = document.querySelector('.detail-produk');

    const divImg = document.createElement('div');
    divImg.className = "img-produk";
    const imgProduk = document.createElement('img');
    imgProduk.src = product.image;
    divImg.append(imgProduk);
    
    const KetProduk = document.createElement('div');
    KetProduk.className = "keterangan-produk";
    const nameProduk = document.createElement('h4');
    nameProduk.textContent = product.name;

    const price = document.createElement('p');
    price.className = "price-produk";
    price.textContent = formatRupiah(product.price);

    const divDetail = document.createElement('div');
    divDetail.className = "detail-wrapper";

    const rowDetail = document.createElement('div');
    rowDetail.className="detail-row";
    const labelDes = document.createElement('span');
    labelDes.className = "label" 
    labelDes.textContent = "Deskripsi"
    const pDeskripsi = document.createElement('p');
    pDeskripsi.textContent = product.description;
    rowDetail.append(labelDes, pDeskripsi);
  
    const rowPengiriman = document.createElement('div');
    rowPengiriman.className="detail-row";
    const labelPengiriman = document.createElement('span');
    labelPengiriman.className = "label" 
    labelPengiriman.textContent = "Pengiriman"
    const pPengiriman = document.createElement('p');
    pPengiriman.textContent = "J&T";
    rowPengiriman.append(labelPengiriman, pPengiriman);

    const rowSize = document.createElement('div')
    rowSize.className = 'detail-row'
    const labelSize = document.createElement('p');
    labelSize.textContent = "Size"
    const divSize = document.createElement('div');
    divSize.className = "card-sizes";
    rowSize.append(labelSize, divSize)

    const rowQty = document.createElement('div');
    rowQty.className = "detail-row";
    const labelQty = document.createElement('p');
    labelQty.textContent = "Quantity"
    const divQtynStok = document.createElement('div');
    divQtynStok.className = "row-qty";
    const divQty = document.createElement('div');
    divQty.className = "kuantitas-wrapper";
    const pStok = document.createElement('div')
    pStok.className = 'p-stok';
    divQtynStok.append(divQty, pStok);
    rowQty.append(labelQty, divQtynStok)
    divDetail.append(rowDetail, rowPengiriman, rowSize, rowQty);

    const butom = document.createElement('div');
    butom.className = "beli-addtochart"
    const btnBeli = document.createElement('button');
    btnBeli.type = "submit";
    btnBeli.className = "btn-beli";
    btnBeli.textContent = "Beli Sekarang";

    const addToCart = document.createElement('div');
    addToCart.className = "add-to-cart";
    const iCart = document.createElement('button');
    iCart.type = 'submit'
    iCart.textContent ="Masukkan Keranjang";
    iCart.className = "btn-beli";
    addToCart.append(iCart);
    butom.append(btnBeli, addToCart);

    KetProduk.append(nameProduk, price, divDetail, butom);
    detailProduk.append(divImg, KetProduk);

addToCart.addEventListener('click', async()=>{
  
  // cek item sudah ada atau belum di cart, dan jika ada apakah qty item melebiihi stok produk yang tersedia atau tidak, jika tidak maka addtocart

  addProductCart()
  document.querySelectorAll('.card-size').forEach(b => b.classList.remove('active'));
  let jumlah = document.querySelectorAll('#jumlah');
  jumlah.forEach(b=> b.value = 0);

  jumlah = 0;
  if(jumlah < 1){
    document.querySelectorAll('.p-stok').forEach(e => e.textContent = `Stok: 0`)
   }

  })

 // ====== Tombol "Beli Sekarang" ======
btnBeli.addEventListener('click', async () => {
    console.log("beli")
    const selected = getSelectedSizeAndQty();
    if (!selected) return;

    // 1. Masukkan ke cart dulu (backend butuh cart_ids, bukan product_id langsung)
   const cartResult = await addProductCart(false); 
   if (!cartResult) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    try {
        // 2. Langsung checkout HANYA item yang barusan ditambahkan
        const checkoutRes = await fetch("https://ecommers-shoes.vercel.app/data-order/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: currentUser.id,
                cart_ids: [cartResult.id]   // ✅ cart_id dari hasil addProductCart
            })
        });

        if (!checkoutRes.ok) {
            const error = await checkoutRes.json();
            alert(`Checkout gagal: ${error.error}`);
            return;
        }

        const result = await checkoutRes.json();
        alert(`Checkout berhasil! Order ID: ${result.order_id}`);
        window.location.href = `detail-order.html?id=${result.order_id}`;

    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat checkout");
    }
});


  }

// Fgngsi tambah qty order 
function inputQty() {
    const divQty = document.querySelector('.kuantitas-wrapper');
    divQty.innerHTML = "";

    const divControl = document.createElement('div');
    divControl.className = "kuantitas-control";

    const btnMinus = document.createElement('button');
    btnMinus.type = "button";
    btnMinus.className = "btn-minus";
    btnMinus.textContent = "−";

    const inputValue = document.createElement('input');
    inputValue.type = "number";
    inputValue.id = "jumlah";
    inputValue.value = jumlah;
    inputValue.min = 1;

    const btnPlus = document.createElement('button');
    btnPlus.type = "button";
    btnPlus.className = "btn-plus";
    btnPlus.textContent = "+";

    

    divControl.append(btnMinus, inputValue, btnPlus);
    divQty.append( divControl);

    // klik tombol +
    btnPlus.addEventListener("click", () => {
        if(jumlah>=stokTersedia){
            return;
        }
        jumlah++;
        syncTampilan(inputValue, btnMinus, btnPlus);
    });

    // klik tombol -
    btnMinus.addEventListener("click", () => {
        if (jumlah > 1) {
            jumlah--;
            syncTampilan(inputValue, btnMinus, btnPlus);
        }
    });

    // user ngetik langsung
    inputValue.addEventListener("input", () => {
        let val = parseInt(inputValue.value);

        if(val > stokTersedia){
            val = stokTersedia;
            inputValue.value = val;
        }

        // kalau kosong atau bukan angka, jangan langsung diproses (biar user masih bisa ngetik)
        if (isNaN(val)) return;

        jumlah = val;
        btnMinus.disabled = jumlah <= 1;
        btnPlus.disabled = jumlah >= stokTersedia;



        syncTampilan(inputValue, btnMinus, btnPlus);
    });

    // saat user selesai ngetik (klik keluar dari input), baru rapikan nilainya
    inputValue.addEventListener("blur", () => {
        if (isNaN(jumlah) || jumlah < 1) {
            jumlah = 1;
        }
        syncTampilan(inputValue, btnMinus,  btnPlus);
    });

    syncTampilan(inputValue, btnMinus, btnPlus);
}


// tampilkan size yang tersedia

function renderSizes(size) {
    const divSize = document.querySelector('.card-sizes');
    divSize.innerHTML = "";

    size.forEach(s => {
        const btnSize = document.createElement('button');
        btnSize.className = "card-size";
        btnSize.textContent = s.size;
        btnSize.dataset.stok = s.stok;
        if (s.stok === 0) btnSize.disabled = true;
    

        divSize.append(btnSize);

        btnSize.addEventListener('click', () => {
            document.querySelectorAll('.card-size').forEach(b => b.classList.remove('active'));
            btnSize.classList.add('active');

            stokTersedia = s.stok;
            jumlah = 1;
            inputQty(); // render ulang kuantitas tiap ganti size
            renderStok(s.stok)
            // document.querySelector('kuantitas-wrapper').textContent = `Stok: ${s.stok}`;
        });
    });
}

// function add order di Detail-Produk-page
function getSelectedSizeAndQty() {
    const selectedSizeEl = document.querySelector('.card-size.active');
    if (!selectedSizeEl) {
        alert("Pilih ukuran terlebih dahulu!");
        return null;
    }
    const size = selectedSizeEl.dataset.size; // sesuaikan attribute yang kamu pakai di elemen size

    const qtyInput = document.querySelector('#jumlah');
    const qty = qtyInput ? Number(qtyInput.value) : 1;
    if (!qty || qty < 1) {
        alert("Jumlah pembelian minimal 1");
        return null;
    }

    return { size, qty };
}


// update value input + warna + disable minus (dipakai pas +/- diklik)
function syncTampilan(inputValue, btnMinus, btnPlus) {
    inputValue.value = jumlah;
    btnMinus.disabled = jumlah <= 1;
    btnPlus.disabled = jumlah >= stokTersedia;
}

function updateJumlahTampilan(inputValue, btnMinus) {
    inputValue.textContent = jumlah;
    inputValue.classList.toggle("melebihi-stok", jumlah > stokTersedia);
    btnMinus.disabled = jumlah <= 1;
}


document.addEventListener("DOMContentLoaded", async () => {
    await getProductDetail();
    await getProductSizes(id);
});