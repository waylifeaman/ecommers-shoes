const endpointSize = "http://localhost:3000/data-size-product"; // nama unik, tidak bentrok "endpoint"

async function getProductSizes(productId) {
    const res = await fetch(`${endpointSize}?product_id=${productId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error("Gagal mengambil data stok");
    return await res.json();
}

async function saveProductSizes(productId, sizesArray) {
    const res = await fetch(`${endpointSize}/bulk`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, sizes: sizesArray })
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
    }
    console.log("berhasil")
    return await res.json();
}

let jumlah = 1;
let stokTersedia = 0;

async function getProductSizes(productId) {
  try {
    const res = await fetch(`http://localhost:3000/data-size-product/product/${productId}`);
    if (!res.ok) throw new Error("Size tidak ditemukan");
    const sizes = await res.json();
    renderSizes(sizes);
  } catch (error) {
    console.error(error.message);
  }
}
function renderStok(stokValue) {
    const pStok = document.querySelector('.p-stok');
    pStok.textContent = `Stok: ${stokValue}`;
}


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
