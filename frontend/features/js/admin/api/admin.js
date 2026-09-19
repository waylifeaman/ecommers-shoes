const endpointSize = "https://ecommers-shoes.vercel.app/data-size-product"; // nama unik, tidak bentrok "endpoint"

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
