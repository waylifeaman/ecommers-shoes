// SideBar

const sidebar = document.querySelector('.nama-user')
sidebar.textContent = currentUser.name; 



async function renderRiwayatOrder(data) {
    const container = document.querySelector(".container-pro");
    container.innerHTML = ""
    if (!data || data.length === 0) {
        const divcon = document.createElement('div')
        divcon.className = "riwayat-content"
        divcon.innerHTML = "<p>Belum ada riwayat order</p>";
        container.append(divcon)
        return;
    }

    data.forEach(i => {
        const divcon = document.createElement('div')
        divcon.className = "riwayat-content"
        const div = document.createElement('div')
        div.className = "head-content"
        const pId = document.createElement('p')
        pId.textContent =  `Order Id: #${i.order_id} `;
        div.append(pId)

        const divContent = document.createElement('div');
        divContent.className = "produk-konten";
        const divIsi = document.createElement('div');
        divIsi.className  ="content-produk"
        const divimg = document.createElement('div')
        divimg.className = 'img'
        const img = document.createElement('img');
        img.src = i.image;
        divimg.append(img)

        const Content = document.createElement('div')
        Content.className = "content";
        const pNP = document.createElement('p')
        pNP.textContent = i.name;
        const pS = document.createElement('p')
        pS.textContent = `Size: ${i.size}`
        const pPrice = document.createElement('p')
        pPrice.textContent = `Price: ${formatRupiah(i.price)}`
        const pQ = document.createElement('p');
        pQ.textContent = `x${i.qty}`
        Content.append(pNP, pS, pPrice, pQ)
        divIsi.append(divimg, Content)        

        const divPrice = document.createElement('div');
        divPrice.className = "total-price";
        const pP = document.createElement('p')
        let total = i.price*i.qty
        pP.textContent =formatRupiah(i.total);
        const btn = document.createElement('button')
        btn.textContent = "Cek Pesanan"
        btn.className = "cek-pesanan"
        btn.onclick = async()=>{
            console.log(i.order_id)    
            window.location.href = `detail-order.html?id=${i.order_id}`;
            // const order = await getOrderDetail(orderId);
            //     console.log(order)
        }
        divPrice.append(pP, btn);
        divContent.append(divIsi, divPrice)
        divcon.append(div, divContent)
        
        container.append(divcon)
    })   
}

    //filter data by setatus    
    async function filterDataBSyStatus(status){
        const filterData =
         status === "all"
        ? allOrder:
        allOrder.filter((i)=>String(i.status) === String(status))
        renderRiwayatOrder(filterData)    
        console.log(filterData)    
    }


    // Fungsi tampilkan data sesuai tab yang di pilih
    const nav = document.querySelector(".tab")
    nav.addEventListener('click', async (e)=>{
    
        console.log('li di klik')
        const DiKlik = e.target.closest('.tab-value') 
        if(!DiKlik)return;

        const liActive = document.querySelector("div.active")
        if(liActive){
                liActive.classList.remove('active')
        }
        DiKlik.classList.add('active');

        const status = DiKlik.id
        filterDataBSyStatus(status)
    })

    
    //tampilkan data berdasarkann setatus sesuai tab yang dipilih 


window.addEventListener("DOMContentLoaded", async()=>{
    if (!currentUser) {
    // belum login, tendang balik ke halaman login
    window.location.href = "../auth/login.html";
    return
    }

    allOrder = await getDataRiwayatOrder(currentUser.id); // fetch SEKALI saja, simpan ke cache
    filterDataBSyStatus("all");

    const logout = document.querySelector('.log-out')
    logout.addEventListener('click',()=>{
        let isConfirm = confirm("Yakin Mau Log-out ?")
    
        if(!isConfirm)return;
        localStorage.removeItem("currentUser")
        location.href="../../../frontend/index.html"
    })
})