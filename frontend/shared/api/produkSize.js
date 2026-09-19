const endpointSize = "https://ecommers-shoes.vercel.app/data-size-product"; // nama unik, tidak bentrok "endpoint"
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
    const res = await fetch(`https://ecommers-shoes.vercel.app/data-size-product/product/${productId}`);
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





