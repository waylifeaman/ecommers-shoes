let activeCategoryId = "all";
let allProduct   = [];

const renderTabCategory = async function () {
    const tabCategory = document.querySelector('.tab-category');
    tabCategory.innerHTML = "";
    const divliat = document.createElement('div');
    divliat.className = 'rowLiat';
    const liatsemua = document.createElement('p');
    liatsemua.className = 'liatSemua';
    liatsemua.onclick = ()=>{
        location.href = "../../features/home/product.html"
    }
    liatsemua.textContent ="Lihat Semua";
    divliat.append(liatsemua);
    const divCategori = document.createElement('div');
    divCategori.className = 'rowCategory';
    const getCategory = await getDataCategory();
    console.log(getCategory);
    getCategory.forEach((Citem, index)=>{
        const divCard = document.createElement('div');
        divCard.className = 'card-category';
        divCard.dataset.id = Citem.id;

        if(index === 0){
            divCard.classList.add('active');
        }
        const p = document.createElement('p');
        p.textContent = Citem.name;
        divCard.append(p);
        divCategori.append(divCard);
    })
    tabCategory.append(divCategori, divliat);

    tabCategory.addEventListener('click', async function (e) {
        const clickedDiv = e.target.closest('.card-category')
        if(!clickedDiv)return;
    
        const tabActive = tabCategory.querySelector('div.active');
            
        if(tabActive){
                tabActive.classList.remove('active');
            }
         clickedDiv.classList.add('active');

        const categoryId = clickedDiv.dataset.id;
        activeCategoryId = categoryId;
        await filterProdukByCategory(categoryId)
       
        }
        
    );
    // TAmpikan ke brower render data sesuai kategori di index 0
    if (getCategory.length > 0) {
        const firstCategoryId = getCategory[0].id;
        activeCategoryId = firstCategoryId;
        await filterProdukByCategory(firstCategoryId);
    }
}

function getLatestProducts(products, limit = 4) {
    return [...products]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit);
}

// FILTER DATA PRODUK BERDASARKAN KATEGORI
async function filterProdukByCategory(categoryId) {
        const filterData = categoryId === "all"
        ? allProduct
        :allProduct.filter((p)=>String(p.category_id) === String(categoryId));
       // ✅ urutkan dari terbaru, lalu ambil 4 saja
   
    renderDataByCat(getLatestProducts(filterData));    
}

function renderDataByCat(product){
    const layer1 = document.querySelector('.layer-1');
    layer1.innerHTML ="";

    for(const item of product) {
        const divCard = document.createElement('div');
        divCard.className = "card-produk";
        divCard.onclick = () => {
        location.href = `../../features/home/detail-produk.html?id=${item.id}`;
        };
        const divImg = document.createElement('div');
        divImg.className = "img-produk";
        const img = document.createElement('img');
        img.src = item.image;
        divImg.append(img);
        const divDes = document.createElement('div');
        divDes.className = "description";
        const price = document.createElement('h4');
        price.textContent = formatRupiah(item.price);
        const namaProduk = document.createElement('p');
        namaProduk.textContent = item.name;
        namaProduk.className= 'nama-produk';
        const deskripsi = document.createElement('p');
        // deskripsi.textContent =item.description;
        deskripsi.textContent ="Good Performent";
        const baru = document.createElement('p');
        baru.textContent = "Baru";
        divDes.append(price, namaProduk, deskripsi, baru)

        divCard.append(divImg, divDes);
        layer1.append(divCard);
    };
}


const renderLayer1 = async function(){
    const getProduk  = await getProduct();
    allProduct  = getProduk;
   
    const produkTerurut = [...getProduk].sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
    );
    const produkTerbaru = produkTerurut.slice(0, 4);
    renderDataByCat(getLatestProducts(produkTerbaru)); 
}

document.addEventListener("DOMContentLoaded", async()=>{
    const kota = document.querySelector('.kotak');
    kota.addEventListener('click',()=>{
        location.href= "../../features/home/product.html"
    });

    await renderLayer1(),
    await renderTabCategory()});