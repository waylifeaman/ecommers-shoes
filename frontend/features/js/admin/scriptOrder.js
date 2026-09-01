let allOrders = [];

async function renderOrder(orders = null) {
    if (!orders) {
        orders = await getOrder();
        allOrders = orders; // simpan ke variabel global, supaya filter tidak perlu fetch ulang
    }

    const tableOrder = document.querySelector('.tabel-conten-produk');
    tableOrder.innerHTML = "";


    if (!orders || orders.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 3;   // supaya melebar mengisi 3 kolom (GAMBAR, DETAIL PRODUK, AKSI)
        td.style.textAlign = "center";
        td.textContent = "Tidak ada data order";
        tr.append(td);
        tableOrder.append(tr);
        return;
    }

    orders.forEach((item) => {
        const tr = document.createElement('tr');
        tr.className = "tr-produk";

        const tdImg = document.createElement('td');
        tdImg.className = "td-image";
        const img = document.createElement('img');
        img.src = item.image;
        tdImg.append(img);

        const tdOrder = document.createElement('td');
        tdOrder.className = "colum-order";
        const pNamaproduk = document.createElement('p');
        pNamaproduk.textContent = "Nama Produk: " + item.name;
        const pPrice = document.createElement('p');
        pPrice.textContent = "Total Pembayaran: " + formatRupiah(item.total);
        const pstatus = document.createElement('p');
        pstatus.textContent = "Status Order: " + item.status;
        pstatus.className = "status";
        tdOrder.append(pstatus, pNamaproduk, pPrice);

        const tdAksi = document.createElement('td');
        tdAksi.className = "aksi";
        const btnAksi = document.createElement('p');
        btnAksi.className = "btn-aksi";

        // ✅ Tombol aksi disesuaikan per status (alur maju satu tahap)
        if (item.status === "pending") {
            btnAksi.textContent = "Cek Pembayaran";
            btnAksi.addEventListener('click', () => Updatestatus(item.order_id, "paid"));
        } else if (item.status === "paid") {
            btnAksi.textContent = "Proses Pesanan";
            btnAksi.addEventListener('click', () => Updatestatus(item.order_id, "prosess"));
        } else if (item.status === "prosess") {
            btnAksi.textContent = "Kirim Pesanan";
            btnAksi.addEventListener('click', () => Updatestatus(item.order_id, "shipped"));
        } else if (item.status === "shipped") {
            btnAksi.textContent = "Tandai Selesai";
            btnAksi.addEventListener('click', () => Updatestatus(item.order_id, "selesai"));
        } else {
            btnAksi.textContent = "-";
        }

        tdAksi.append(btnAksi);
        tr.append(tdImg, tdOrder, tdAksi);

        tableOrder.append(tr);
    });
}

function tabStatus() {
    const tab = document.querySelector('.tab-order');

    tab.addEventListener('click', async (e) => {
        if (e.target.tagName === "LI") {
            const divActive = tab.querySelector("li.active");
            if (divActive) {
                divActive.classList.remove('active');
            }
            e.target.classList.add('active');

            const statusId = e.target.id; // "pending", "paid", "prosess", "shipped", "selesai", "cancel"
            await filterOrderByStatus(statusId);
        }
    });
}

async function filterOrderByStatus(status) {
    const filtered = allOrders.filter((item) => item.status === status);
    renderOrder(filtered);
}

async function Updatestatus(orderId, newStatus) {
    const isPaid = confirm(`Ubah status pesanan menjadi "${newStatus}"?`);
    if (!isPaid) return;

    try {
        await updateOrderStatus(orderId, newStatus);
        alert(`Status berhasil diubah menjadi "${newStatus}"`);

        // ✅ update status item yang sesuai di allOrders, TANPA fetch ulang
        allOrders = allOrders.map((item) =>
            item.order_id === orderId ? { ...item, status: newStatus } : item
        );

        const activeTab = document.querySelector('.tab-order li.active');
        const activeStatus = activeTab ? activeTab.id : "pending";
        await filterOrderByStatus(activeStatus);
    } catch (err) {
        alert("Gagal update status: " + err.message);
    }
}

// Inisialisasi
document.addEventListener("DOMContentLoaded", async (e) => {
    e.preventDefault()
    await renderOrder(); // render semua dulu, isi allOrders
    await filterOrderByStatus("pending"); // langsung filter ke tab default ("Baru")
    tabStatus(); // pasang listener klik tab
});