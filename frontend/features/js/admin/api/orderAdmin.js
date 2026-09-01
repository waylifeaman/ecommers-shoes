async function getOrder(){
    const res = await fetch('http://localhost:3000/data-order/order-admin',{
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }
    )
    if (!res.ok) throw new Error("Gagal mengambil data stok");
    return await res.json();

} 

async function updateOrderStatus(orderId, status) {
    const res = await fetch(`http://localhost:3000/data-order/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
    }

    return await res.json();
}