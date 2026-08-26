
let allProduct=[]

const renderTabCategoryProduct = async function() {
    const tabCategory = document.querySelector('.tab-category-product');
    tabCategory.innerHTML = "";
    
    const getCategory = await getDataCategory();
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
        tabCategory.append(divCard);
    })

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

        const filteredProduct = allProduct.filter(item => item.category_id == categoryId);
        RendercardProduk(filteredProduct);
       
        }
        
    );
    // TAmpikan ke brower render data sesuai kategori di index 0
    if (getCategory.length > 0) {
        const firstCategoryId = getCategory[0].id;
        activeCategoryId = firstCategoryId;
        const filteredProduct = allProduct.filter(item => item.category_id == firstCategoryId);
        RendercardProduk(filteredProduct)
    }
}


// RENDER CARD DATA PRODUK
function RendercardProduk(product){
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
        deskripsi.textContent =item.description;
        deskripsi.className = 'deskripsi-produk';
        const good = document.createElement('p');
        good.textContent ="Good Performent";
        const baru = document.createElement('p');
        baru.textContent = "Baru";
        divDes.append(price, namaProduk,deskripsi, good, baru)

        divCard.append(divImg, divDes);
        layer1.append(divCard);
    };
}

function getLatestProducts(products) {
    return [...products]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

const renderLayer1Produk = async function(){
    const getProduk  = await getProduct();
    allProduct  = getProduk;
       console.log(getProduk)
    const produkTerurut = [...getProduk].sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
    );
    RendercardProduk(getLatestProducts(allProduct)); 
}



document.addEventListener("DOMContentLoaded", async()=>{
    await renderLayer1Produk(),
    await renderTabCategoryProduct()});