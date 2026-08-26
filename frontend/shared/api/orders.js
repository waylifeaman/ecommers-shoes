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

function renderOrderDetail(order) {
    const container = document.querySelector(".order-detail");

    if (!order) {
        container.innerHTML = "<p>Order tidak ditemukan</p>";
        return;
    }

    container.innerHTML = "";

    // header info order
    const headerInfo = document.createElement('div');
    headerInfo.className = "order-header";
    headerInfo.innerHTML = `
        <p>Order ID: #${order.id}</p>
        <p>Status: ${order.status}</p>
        <p>Tanggal: ${new Date(order.created_at).toLocaleDateString('id-ID')}</p>
    `;
    container.append(headerInfo);

    // list item di order ini
    const itemList = document.createElement('div');
    itemList.className = "order-item-list";

    order.items.forEach(item => {
        const div = document.createElement('div');
        div.className = "order-item";
        div.innerHTML = `
            <img src="${item.image}" class="order-item-img">
            <div class="order-item-info">
                <h4>${item.name}</h4>
                <p>Size: ${item.size} | Qty: ${item.qty}</p>
                <p>${formatRupiah(item.price)}</p>
            </div>
        `;
        itemList.append(div);
    });

    container.append(itemList);

    // total keseluruhan
    const totalDiv = document.createElement('div');
    totalDiv.className = "order-total";
    totalDiv.innerHTML = `<p>Total: ${formatRupiah(order.total)}</p>`;
    container.append(totalDiv);
}

document.addEventListener("DOMContentLoaded", async () => {
    const order = await getOrderDetail(orderId);
    renderOrderDetail(order);
});