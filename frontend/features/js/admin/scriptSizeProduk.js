const SIZE_LIST = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

const modalOverlaySize = document.getElementById("modalOverlaySize");
const formProductSize = document.getElementById("formProductSize");
const sizeProductIdInput = document.getElementById("sizeProductId");
const sizeInputsContainer = document.getElementById("sizeInputsContainer");
const btnCloseModalSize = document.getElementById("btnCloseModalSize");
const btnCancelSize = document.getElementById("btnCancelSize");

function closeModalSize() {
    modalOverlaySize.classList.add("hidden");
    formProductSize.reset();
}

btnCloseModalSize.addEventListener("click", closeModalSize);
btnCancelSize.addEventListener("click", closeModalSize);

// Dipanggil dari tombol "Kelola Stok" di tabel produk
window.openSizeModal = async function (product) {
    sizeProductIdInput.value = product.id;
    sizeInputsContainer.innerHTML = "";

    // Ambil stok yang sudah ada untuk produk ini
    const existingSizes = await getProductSizes(product.id);
    // ubah jadi map { 36: 5, 37: 0, ... } biar gampang dicari
    const stokMap = {};
    existingSizes.forEach((s) => {
        stokMap[s.size] = s.stok;
    });

    // Generate input untuk tiap ukuran 36-45
    SIZE_LIST.forEach((size) => {
        const wrapper = document.createElement("div");
        wrapper.className = "size-input-item";

        const label = document.createElement("label");
        label.textContent = `Size ${size}`;
        label.htmlFor = `size-${size}`;

        const input = document.createElement("input");
        input.type = "number";
        input.id = `size-${size}`;
        input.min = "0";
        input.value = stokMap[size] ?? 0; // isi dengan stok yang sudah ada, atau 0 kalau belum ada

        wrapper.append(label, input);
        sizeInputsContainer.append(wrapper);
    });

    modalOverlaySize.classList.remove("hidden");
};

formProductSize.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productId = sizeProductIdInput.value;

    const sizesArray = SIZE_LIST.map((size) => {
        const input = document.getElementById(`size-${size}`);
        return {
            size: size,
            stok: Number(input.value) || 0
        };
    });

    try {
        await saveProductSizes(productId, sizesArray);
        alert("Stok berhasil disimpan!");
        console.log(productId)
        console.log(sizesArray)
        closeModalSize();
        renderData();
    } catch (err) {
        alert("Gagal menyimpan stok: " + err.message);
    }
});