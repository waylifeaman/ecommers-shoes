const currentUser = JSON.parse(localStorage.getItem("currentUser"));


if (!currentUser) {
    // belum login, tendang balik ke halaman login
    window.location.href = "../auth/login.html";
}
let editingId = null;
let activeCategoryId = "all";

//function FORM ADD PRODUCT
const form = async function (){
    const formDiv = document.querySelector("#form-container");
    formDiv.innerHTML = "";
    const formEl = document.createElement("form");
    formEl.id="form-produk";

    const labelName = document.createElement('label');
    labelName.setAttribute('for', 'name');
    labelName.textContent = "Nama Produk";
    const inputName = document.createElement("input");
    inputName.type = 'text';
    inputName.id = 'name';
    inputName.name = 'name';
    inputName.placeholder = 'Nike Air Max 90';
    inputName.required = true;

    const labelBrand = document.createElement('label');
    labelBrand.htmlFor = "brand";
    labelBrand.textContent = "Nama Brand";
    const inputBrand = document.createElement("input");
    inputBrand.type ="text";
    inputBrand.id ="brand";
    inputBrand.name="brand";
    inputBrand.placeholder ="Nike Zoom 5";
    inputBrand.required = true;

    const labelPrice = document.createElement('label');
    labelPrice.htmlFor = "price";
    labelPrice.textContent="Harga";
    const inputPrice = document.createElement('input');
    inputPrice.type = "number";
    inputPrice.id="price";
    inputPrice.name="price";
    inputPrice.placeholder="500000";
    inputPrice.required=true;

    const labelDeskripsi = document.createElement('label');
    labelDeskripsi.htmlFor = "description";
    labelDeskripsi.textContent="Deskripsi";
    const inputDes=document.createElement('input');
    inputDes.type ="text";
    inputDes.id="description";
    inputDes.name="description";
    inputDes.placeholder="Jelaskan Deskripsi Produk";
    inputDes.required= true;

    const labelImg = document.createElement('label');
    labelImg.htmlFor = "image";
    labelImg.textContent="Link Gambar";
    const inputImgsrc = document.createElement('input');
    inputImgsrc.type = "text";
    inputImgsrc.id = "image";
    inputImgsrc.name="image";
    inputImgsrc.placeholder = "Masukkan Link Gambar";
    inputImgsrc.required=true;

    const labelKategori = document.createElement('label');
    labelKategori.htmlFor="category_id";
    labelKategori.textContent="Pilih Kategori"
    async function selectCategory() {
        const pilihKategori = document.createElement('select');
        pilihKategori.id="category_id";
        pilihKategori.name = "category_id";
        pilihKategori.required=true;
        
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Pilih Kategori";
        pilihKategori.append(defaultOption);

        //data kategori dari db
        const category = await getDataCategory();
        category.forEach((item)=> {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            pilihKategori.append(option);        
    });
    return pilihKategori;
    }

    const selectKategory=await selectCategory();
    const btnSimpan = document.createElement('button');
    btnSimpan.className = 'btn';
    btnSimpan.type = "submit";
    btnSimpan.id ="btn-simpan";
    btnSimpan.textContent="Simpan Produk"

    formEl.append(labelName, inputName, labelBrand, inputBrand, 
        labelPrice, inputPrice, labelDeskripsi, inputDes, labelImg, inputImgsrc, labelKategori, selectKategory, btnSimpan );

    formDiv.append(formEl);

    formEl.addEventListener('submit', async(e)=>{
        e.preventDefault();
        const nameValue = inputName.value.trim();
        const brandValue = inputBrand.value.trim();
        const priceValue = inputPrice.value.trim();
        const descriptionValue = inputDes.value.trim();
        const imgValue = inputImgsrc.value.trim();
        const categoryValue = selectKategory.value;

        if(!nameValue || !brandValue ||!priceValue || !descriptionValue || !imgValue){
            alert("Isi Data Dengan Lengkap !!")
            return;
        }
        const dataProduk ={
            name: nameValue,
            brand: brandValue,
            price: Number(priceValue), 
            description: descriptionValue,
            image: imgValue,
            category_id: categoryValue ? Number(categoryValue) : null
        }
        try{
            if(editingId !== null){
                await editProduct(editingId, dataProduk);
                // alert('produk berhasil di update');
                editingId = null;
                btnSimpan.textContent = "Simpan Produk"

            }else{
                await addProduct(dataProduk);
                    // alert("Produk berhasil ditambahkan!");
            }          
            await renderByActiveCategory();
            formEl.reset();

        }catch(err){
            console.log(err.message);
            alert("Gagal menambahkan produk: " + err.message);
        }                
    });
    window.startEditProduct = function (item) {
        inputName.value = item.name;
        inputBrand.value = item.brand;
        inputPrice.value = item.price;
        inputDes.value = item.description;
        inputImgsrc.value = item.image;
        selectKategory.value = item.category_id ?? "";

        editingId = item.id;
        btnSimpan.textContent = "Update Produk";
        formEl.scrollIntoView({ behavior: "smooth" });
    };



}
 // FILTER  PRODUK YANG DI RENDER SESUAI KATEGORI
    async function renderByActiveCategory() {
        const products = await getProduct();

        let filteredProducts;

        if (activeCategoryId === "all") {
            filteredProducts = products;
        } else {
            filteredProducts = products.filter(
                item => Number(item.category_id) === Number(activeCategoryId)
            );
        }

        await renderData(filteredProducts);
    }
// TAB CATEGORY
const tabCategory = async function() {
    const contentTab = document.querySelector(".tab-category");
    contentTab.innerHTML = "";
    
    const ul = document.createElement('ul');
    
    // 1. Buat menu "Semua"
    const liSemua = document.createElement('li');
    liSemua.className = "active";
    liSemua.textContent = "Semua";
    liSemua.dataset.id = "all";
    ul.append(liSemua);

    // 2. Load data kategori dari DB
    const category = await getDataCategory();
    category.forEach((item) => {
        const liCategory = document.createElement('li');            
        liCategory.textContent = item.name; 
        liCategory.dataset.id = item.id;
        ul.append(liCategory); 
    });

    // 3. EVENT DELEGATION PADA UL (Di luar forEach)
    ul.addEventListener('click', async function(e) {
        if (e.target.tagName === 'LI' && !e.target.classList.contains('search')) {
            const currentActive = ul.querySelector('li.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            e.target.classList.add('active');
            
            const categoryId = e.target.dataset.id;
            activeCategoryId = categoryId;
            await filterDataByCategory(categoryId);
        }
    });

    // 4. Buat Elemen Search Bar di paling akhir UL
    const liSearch = document.createElement('li');
    liSearch.className = "search";

    const divSearch = document.createElement('div');
    divSearch.className = "searchbar-wrapper";

    const inputSearch = document.createElement("input");
    inputSearch.type = "text";
    inputSearch.className = "search-produk";
    inputSearch.placeholder = "Cari Produk Berdasarkan Nama";
    const spanSearch = document.createElement('span');
    spanSearch.className = "search-count";

    divSearch.append(inputSearch, spanSearch);
    liSearch.append(divSearch);
    ul.append(liSearch);

    // 5. Masukkan UL ke dalam Container Tab
    contentTab.append(ul); 
};

// FUNCTION SEARCH
const searchFunction = function(){
    const inputSearch = document.querySelector(".search-produk");

    inputSearch.addEventListener("input", async function () {
        const keyword = this.value.toLowerCase().trim();

        const products = await getProduct();

        const filteredProducts = products.filter((item) =>
            item.name.toLowerCase().includes(keyword)
        );

        await renderData(filteredProducts);
    });

}


//RENDER DATA KE BROWSER
let categoryMap = {};
async function LoadCategory() {
        const categories = await getDataCategory();
        categories.forEach((cat)=>{
            categoryMap[cat.id]=cat.name;
        });
    }
const renderData = async function(products = null){
    
     if (!products) {
        products = await getProduct();
    }

    await LoadCategory();
    const listProduct = document.querySelector("#list-product");
    listProduct.innerHTML = "";


    for (const item of products){
        const trContent = document.createElement("tr");
        const tdimg = document.createElement('td');
        const img = document.createElement('img');
        img.src = item.image;
        tdimg.append(img);

        const tdDetail = document.createElement("td");
        tdDetail.className = "detail" 
        const divDetailTop = document.createElement('div');
        divDetailTop.className = "div-detail-top";
        const namaP =document.createElement('p')
        namaP.textContent = item.name;
        namaP.className = "nama-produk";
        const pKategori = document.createElement('p')
        pKategori.className = "kategori"
        pKategori.textContent = categoryMap[item.category_id] || "No Category";
        const pHarga = document.createElement('p');
        pHarga.className = "price"
        pHarga.textContent = formatRupiah(item.price);
        divDetailTop.append(namaP, pKategori, pHarga)

        const divDeskripriDetail = document.createElement('div');
        divDeskripriDetail.className = "div-detail-bottom";
        const pDeskripsi = document.createElement('p');        
        pDeskripsi.textContent= item.description;
        pDeskripsi.className = "product-desc";     
        divDeskripriDetail.append(pDeskripsi)
        tdDetail.append(divDetailTop, divDeskripriDetail);

        const tdSize = document.createElement('td');
        const tdStok = document.createElement('td');
        tdSize.className = "text-center";
        tdStok.className = "text-center";

        async function selectSizeFunction(productId) {
            const selectSize = document.createElement('select');
            const setok = document.createElement('p')
        
            const option = await getProductSizes(productId);
            option.forEach((sizeItem)=>{
                const opsiSize = document.createElement('option');
                opsiSize.value = sizeItem.id;
                opsiSize.text = `${sizeItem.size}`;                
                selectSize.append(opsiSize);         
            })
            if(option.length > 0){
                setok.textContent = option[0].stok;
            }

            selectSize.addEventListener('change', () => {
            const selected = option.find((s) => s.id == selectSize.value);
            setok.textContent = selected ? `${selected.stok}` : "";
              
    });
            return  { selectSize, setok };
        }

        const { selectSize: piilihSize, setok: piilihsetok } = await selectSizeFunction(item.id);
        tdSize.append(piilihSize);
        const btnStok = document.createElement("button");
        btnStok.textContent = "update";
        btnStok.addEventListener("click", () => openSizeModal(item));
        tdStok.append(piilihsetok, btnStok);

        const tdAfktif = document.createElement('td');
        const toggleWrapper = document.createElement("label");
        toggleWrapper.className = "toggle-switch";
        const toggleInput = document.createElement("input");
        toggleInput.type = "checkbox";
        toggleInput.checked = item.is_active === 1; 
        toggleInput.addEventListener("change", () => toggleProductStatus(item));
        const toggleSlider = document.createElement("span");
        toggleSlider.className = "toggle-slider";
        toggleWrapper.append(toggleInput, toggleSlider);
        tdAfktif.appendChild(toggleWrapper);

        const tdAksi = document.createElement('td');
        const btnEdit = document.createElement('span');
        btnEdit.className = "btn-edit";
        const iconEdit = document.createElement('i');
        iconEdit.className = "fa-solid fa-pen-to-square";
        btnEdit.append(iconEdit);
        btnEdit.addEventListener('click',()=>{startEditProduct(item)})
        tdAksi.append(btnEdit);

        trContent.append(tdimg, tdDetail, tdSize, tdStok, tdAfktif, tdAksi);
        listProduct.append(trContent);
    }
   

}


// Aktif / non aktif PRODUK
async function toggleProductStatus(item) {
    try {
        if (item.is_active) {
            await deleteProduct(item.id);      // nonaktifkan
        } else {
            await activateProduct(item.id);    // aktifkan lagi
        }
     } catch (err) {
        console.log(err.message);
        alert("Gagal mengubah status produk: " + err.message);
    }
}





document.addEventListener("DOMContentLoaded", async () => {
    await tabCategory();
    await form();
    await renderData();
    searchFunction();
});