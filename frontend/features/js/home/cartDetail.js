
let cartItemsGlobal = [];
function renderCart(cartItem) {
    

    const container = document.querySelector(".produk-content");
    container.innerHTML = ""; 
    if (cartItem.length === 0) {
            container.innerHTML = "<tr><td colspan='3'>Keranjang kosong</td></tr>";
            return;
    }
    cartItem.forEach(item => {

        const card = document.createElement('div');
        card.className = 'card-pesanan'
        const divcheckbox = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.className = "checkbox-item";
        checkbox.dataset.cartId = item.cart_id;
        divcheckbox.append(checkbox)
        const divImg = document.createElement('div');
        divImg.className = "detail-pesanan";            
        const img = document.createElement('img');
        img.className = "image-produk";  
        img.src = item.image;

        const produk = document.createElement('div');
        produk.className = "keterangan";
        const pName = document.createElement('p');
        pName.textContent = item.name ;
        const pDes = document.createElement('p');
        pDes.textContent = "" ;
        pDes.className = "deskripsi-produk"
        const pSize = document.createElement('p');
        pSize.textContent ="Size:" + " "+ item.size ;
        produk.append(pName, pDes, pSize);
        divImg.append(img, produk);

        const price = document.createElement('p');
        price.textContent = formatRupiah(item.price);
        const pQty = document.createElement('p');
        pQty.textContent =item.qty ;

        const TotalPrice = document.createElement('p');
        let total = item.qty * item.price;
        TotalPrice.textContent = formatRupiah(total);

        const tdAksi = document.createElement('td');
        tdAksi.className = "td-aksi";
        const btnHapus = document.createElement('button');
        btnHapus.addEventListener('click',()=>{
                console.log("pp")
                DeleteDataCart(item.cart_id)
        })
        btnHapus.textContent = "Hapus";
        tdAksi.append(btnHapus);
        
        card.append(divcheckbox, divImg, price, pQty, TotalPrice, tdAksi);
        container.append(card)

    

        checkbox.addEventListener('change',()=>{
            updateSummary()
        })
    })
}

function getLatestProducts(cartItem) {
    return [...cartItem]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

//fungsi pilih checkbox
function getSelectedItems() {
  const checkboxes = document.querySelectorAll('.checkbox-item:checked');
  return Array.from(checkboxes).map(cb => cb.dataset.cartId);
}

// fungsi piliuh semua
const pilihSemua = document.querySelector('#pilih-semua')
pilihSemua.addEventListener('change',(e)=>{
    const getAllCheckbox = document.querySelectorAll('.checkbox-item')
    getAllCheckbox.forEach(all => all.checked = e.target.checked);
     updateSummary();
})

// HAPUS SEMUA 
const btnHapusAll = document.querySelector('.delete-item');
btnHapusAll.addEventListener('click',async()=>{
    const selectedIds = getSelectedItems()

    if(selectedIds.length === 0){
     console.log("pilih item yang mau di hapus")          
        return;
    }

    let korfirm = confirm("Yakin Mau Hapus Item ini dari keranjang ?")
    if(!korfirm)return;

    for (const cartId of selectedIds) {
        await fetch(`${endPointCart}/${cartId}`, { method: "DELETE" });
    }

    alert("Item berhasil dihapus");

      // ambil ulang data cart terbaru, lalu render ulang
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const updatedCart = await getDataCart(currentUser.id);
    cartItemsGlobal = updatedCart;
    renderCart(getLatestProducts(updatedCart));
})

//Update data harga dan produk di footer
function updateSummary() {
    const selectedIds = getSelectedItems(); // array of cart_id yang dicentang (masih string)

    // filter cartItemsGlobal, ambil cuma yang cart_id-nya ada di selectedIds
    const selectedItems = cartItemsGlobal.filter(item => 
        selectedIds.includes(String(item.cart_id))
    );

    // hitung total qty & total harga
    const totalQty = selectedItems.reduce((sum, item) => sum + item.qty, 0);
    const totalHarga = selectedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    document.querySelector('#total-produk').textContent = totalQty;
    document.querySelector('#total-harga').textContent = formatRupiah(totalHarga);
}

const btnCheckOut = document.querySelector('.ckeckout');
btnCheckOut.addEventListener('click', async () => {
    const selectedIds = getSelectedItems(); // array cart_id, dari checkbox yang dicentang

    if (selectedIds.length === 0) {
        alert("Pilih item terlebih dahulu");
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    try {
        const res = await fetch("https://ecommers-shoes.vercel.app/data-order/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: currentUser.id,
                cart_ids: selectedIds.map(Number) // pastikan berupa angka, bukan string
            })
        });

        if (!res.ok) {
            const error = await res.json();
            alert(`Checkout gagal: ${error.error}`);
            return;
        }

        const result = await res.json();
        alert(`Checkout berhasil! Order ID: ${result.order_id}`);

        // redirect ke halaman order/riwayat, atau refresh cart
        window.location.href = `detail-order.html?id=${result.order_id}`;

    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat checkout");
    }
});



document.addEventListener("DOMContentLoaded", async ()=>{
   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("Silakan login dulu");
        return;
    }
    const cartItems = await getDataCart(currentUser.id);
    cartItemsGlobal = cartItems;

    renderCart(getLatestProducts(cartItems));



})