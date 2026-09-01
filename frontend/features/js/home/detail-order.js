

function renderOrderDetail(order) {
    
    const container = document.querySelector(".order-detail");
    
    const containerItem = document.createElement("div");
    containerItem.className= "container-item";
    
    if (!order) {
        container.innerHTML = "<p>Order tidak ditemukan</p>";
        return;
    }

    container.innerHTML = "";


    // list item di order ini
    const itemList = document.createElement('div');
    itemList.className = "order-item-list";

    order.items.forEach(item => {        
        const div = document.createElement('div');
        div.className = "order-item";
        let itemTotal = item.price * item.qty;
        console.log = (item.id)
        div.innerHTML = `
            <div class="col-1">
                <img src="${item.image}" class="order-item-img">
                <div class="order-item-info">
                    <p style="border-bottom: 1px solid grey; color: grey">Order ID: #${order.id} || <span>Status: ${order.status}</span></p>
                    <h3>${item.name}</h3>
                    <p>Size: ${item.size}</p>
                    <p></p>
                </div>
            </div>

            <div class="col-2">                
                <div calss="order-status">
                       <p>${formatRupiah(item.price)}</p>
                </div>
            </div>

            <div class="col-3">                    
                     <p> ${item.qty}</p>
            </div>

            <div class = "col-4">
                <p>${formatRupiah(itemTotal)}</p>
            </div>



        `;
        itemList.append(div);
    });


    containerItem.append(itemList);
    container.append(containerItem)


    // tombol konfirmasi bayar -- CUMA MUNCUL kalau status masih "pending"
    if (order.status === "pending") {
        const bayar = document.createElement('div')
        bayar.className = "card-konfirmBayar"
        const sub = document.createElement('div')
        
             sub.innerHTML = `
            <p>Sub Pesanan ${formatRupiah(order.total)}</p>
        `
        
       
        const btnBayar = document.createElement('button');
        btnBayar.className = "btn-bayar";
        btnBayar.textContent = "Bayar Sekarang";
        bayar.append( sub, btnBayar);
        btnBayar.addEventListener('click', () => KonfirmasiPembayaran(order.id));

        container.append(containerItem, bayar);
    }
}