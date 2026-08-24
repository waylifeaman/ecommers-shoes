
const endpoint = "http://localhost:3000/data-product";


// ============ GET DATA ============
async function getProduct() {
    try {
        const res = await fetch(`${endpoint}?all=true`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }

        allProducts = await res.json();
        allProducts.sort((a, b) => b.id - a.id);
        return allProducts;
    } catch (error) {
        console.error("Gagal Mengambil Data", error);
        container.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; color: red;">Gagal memuat data produk.</td>
            </tr>
        `;
        return[];
    }
}

// ============ TAMBAH PRODUK ============
async function addProduct(data) {

    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const error = await res.json();
        showAlert(`Tambah produk gagal: ${error.error}`, "error");
        return;
    }

    await res.json();
    showAlert("Produk berhasil ditambahkan!", "success", () => {
        getProduct();
    });
}

// ============ EDIT PRODUK ============
async function editProduct(id, data) {
    const res = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)   // ✅ di-stringify
    });

    if (!res.ok) {
        const error = await res.json();
        showAlert(`Update produk gagal: ${error.error}`, "error");
        return;
    }

    await res.json();
    showAlert("Produk berhasil diupdate!", "success", () => {
        getProduct();
    });
}
// ============ HAPUS PRODUK ============
async function deleteProduct(id) {
    const res = await fetch(`${endpoint}/${id}`, {
        method: "DELETE"
    });

    if (!res.ok) {
        const error = await res.json();
        showAlert(`Nonaktifkan produk gagal: ${error.error}`, "error");
        return;
    }

    showAlert("Produk berhasil dinonaktifkan!", "success", () => {
        renderData();
    });
}
//Active Product
async function activateProduct(id) {
    const res = await fetch(`${endpoint}/${id}/activate`, { method: "PUT" });
    if (!res.ok) {
        const error = await res.json();
        showAlert(`Gagal mengaktifkan: ${error.error}`, "error");
        return;
    }
    showAlert("Produk berhasil diaktifkan kembali!", "success", () => getProduct());
}
async function getProductByCategory(categoryId) {
    try {
        const res = await fetch(`${endpoint}?category_id=${categoryId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Gagal Mengambil Data Kategori", error);
        return [];
    }
}

async function filterDataByCategory(categoryId) {
    const products = await getProduct();

    let filteredProducts;

    if (categoryId === "all") {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(
            item => Number(item.category_id) === Number(categoryId)
        );
    }

    console.log("Category ID:", categoryId);
    console.log("Filtered products:", filteredProducts);

    await renderData(filteredProducts);
}


getProduct();