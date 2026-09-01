// const btnCheckOut= document.querySelector('.ckeckout');

// render detail order
const params = new URLSearchParams(window.location.search);
const orderId = Number(params.get("id"));

async function getOrderDetail(orderId) {
    try {
        const res = await fetch(`http://localhost:3000/data-order/${orderId}`);

        if (!res.ok) {
            throw new Error("Order tidak ditemukan");
        }

        return await res.json();

    } catch (err) {
        console.error(err.message);
        return null;
    }
}

// Konfimasi Setatus Pembayaran
async function KonfirmasiPembayaran(orderId) {
     const konfirmasi = confirm("Konfirmasi bahwa kamu sudah melakukan pembayaran?");
    if (!konfirmasi) return;
     try {
        const res = await fetch(`http://localhost:3000/data-order/${orderId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "paid" })
        });

        if (!res.ok) {
            throw new Error("Gagal mengonfirmasi pembayaran");
        }

        alert("Pembayaran berhasil dikonfirmasi!");

        // render ulang halaman biar status & tombol ter-update
        const updatedOrder = await getOrderDetail(orderId);
        // renderOrderDetail(updatedOrder);
        location.href = `akun-saya.html`

    } catch (err) {
        console.error(err.message);
        alert("Gagal mengonfirmasi pembayaran");
    }
}

//tabb status
function tabStatus(){
    
}



document.addEventListener("DOMContentLoaded", async () => {
    const order = await getOrderDetail(orderId);
    renderOrderDetail(order);

    const back = document.querySelector('.back');
    if (back) {
        back.addEventListener('click', () => {
            location.href = '../../features/home/cart.html';
        });
    }
});