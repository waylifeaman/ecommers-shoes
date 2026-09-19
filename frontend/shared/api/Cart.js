const endPointCart = "https://ecommers-shoes.vercel.app/data-cart";
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    alert("Silakan login dulu");
    // sebaiknya redirect, bukan cuma alert:
    window.location.href = "login.html";
}

async function addProductCart(redirectToCart = true) {
    const sizeActive = document.querySelector(".active");
    if (!sizeActive) {
        alert("pilih size terlebih dulu");
        return null;   // ✅ return null kalau gagal, supaya pemanggil tahu harus berhenti
    }
    const size = Number(sizeActive.textContent);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser.id;
    const cartItems = await getDataCart(userId);

    const item = cartItems.find(i => i.product_id === id && i.size === size);

    const qtyLama = item ? item.qty : 0;
    const totalQtyNanti = qtyLama + jumlah;

    if (totalQtyNanti > stokTersedia) {
        alert(`Stok tidak mencukupi. Stok tersedia: ${stokTersedia}, di keranjang sudah ada: ${qtyLama}`);
        return null;
    }

    const data = {
        user_id: currentUser.id,
        product_id: id,
        size: size,
        qty: jumlah
    };

    try {
        const res = await fetch(endPointCart, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const error = await res.json();
            alert(`Tambah Produk gagal: ${error.message || error.error}`);
            return null;
        }

        const result = await res.json();   // ✅ ambil hasilnya, termasuk "id" cart

        // ✅ redirect HANYA kalau diminta (default: true, untuk tombol "Masukkan Keranjang")
        if (redirectToCart) {
            alert("Produk Berhasil Ditambah Ke Keranjang");
            location.href = "../../features/home/cart.html";
        }

        return result;   // ✅ selalu return hasilnya, supaya bisa dipakai lanjut checkout
    } catch (err) {
        console.log("error", err);
        return null;
    }
}
async function getDataCart(userId) {
    try {
        const res = await fetch(`${endPointCart}/user/${userId}`);

        if (!res.ok) {
            console.log("route tidak ditemukan");
            return [];
        }

        return await res.json();

    } catch (err) {
        console.log("data tidak ditemukan", err);
        return [];
    }
}

async function DeleteDataCart(id) {
    const res = await fetch(`${endPointCart}/${id}`,
        {method:"DELETE"}
    );
    if (!res.ok) {
    throw new Error("Gagal menghapus item");
  }
  console.log(`hapus`, id);
    const updatedCart = await getDataCart(currentUser.id);
    return renderCart(getLatestProducts(updatedCart));
}
