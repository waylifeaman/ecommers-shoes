const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));


function renderProduct(product){
    const detailProduk = document.querySelector('.detail-produk');

    const divImg = document.createElement('div');
    divImg.className = "img-produk";
    const imgProduk = document.createElement('img');
    imgProduk.src = product.image;
    divImg.append(imgProduk);
    
    const KetProduk = document.createElement('div');
    KetProduk.className = "keterangan-produk";
    const nameProduk = document.createElement('h4');
    nameProduk.textContent = product.name;

    const price = document.createElement('p');
    price.className = "price-produk";
    price.textContent = formatRupiah(product.price);

    const divDetail = document.createElement('div');
    divDetail.className = "detail-wrapper";

    const rowDetail = document.createElement('div');
    rowDetail.className="detail-row";
    const labelDes = document.createElement('span');
    labelDes.className = "label" 
    labelDes.textContent = "Deskripsi"
    const pDeskripsi = document.createElement('p');
    pDeskripsi.textContent = product.description;
    rowDetail.append(labelDes, pDeskripsi);
  
    const rowPengiriman = document.createElement('div');
    rowPengiriman.className="detail-row";
    const labelPengiriman = document.createElement('span');
    labelPengiriman.className = "label" 
    labelPengiriman.textContent = "Pengiriman"
    const pPengiriman = document.createElement('p');
    pPengiriman.textContent = "J&T";
    rowPengiriman.append(labelPengiriman, pPengiriman);

    const rowSize = document.createElement('div')
    rowSize.className = 'detail-row'
    const labelSize = document.createElement('p');
    labelSize.textContent = "Size"
    const divSize = document.createElement('div');
    divSize.className = "card-sizes";
    rowSize.append(labelSize, divSize)

    const rowQty = document.createElement('div');
    rowQty.className = "detail-row";
    const labelQty = document.createElement('p');
    labelQty.textContent = "Quantity"
    const divQtynStok = document.createElement('div');
    divQtynStok.className = "row-qty";
    const divQty = document.createElement('div');
    divQty.className = "kuantitas-wrapper";
    const pStok = document.createElement('div')
    pStok.className = 'p-stok';
    divQtynStok.append(divQty, pStok);
    rowQty.append(labelQty, divQtynStok)
    divDetail.append(rowDetail, rowPengiriman, rowSize, rowQty);

    const butom = document.createElement('div');
    butom.className = "beli-addtochart"
    const btnBeli = document.createElement('button');
    btnBeli.type = "submit";
    btnBeli.className = "btn-beli";
    btnBeli.textContent = "Beli Sekarang";

    const addToCart = document.createElement('div');
    addToCart.className = "add-to-cart";
    const iCart = document.createElement('button');
    iCart.type = 'submit'
    iCart.textContent ="Masukkan Keranjang";
    iCart.className = "btn-beli";
    addToCart.append(iCart);
    butom.append(btnBeli, addToCart);

    KetProduk.append(nameProduk, price, divDetail, butom);
    detailProduk.append(divImg, KetProduk);

addToCart.addEventListener('click', async()=>{
  
  // cek item sudah ada atau belum di cart, dan jika ada apakah qty item melebiihi stok produk yang tersedia atau tidak, jika tidak maka addtocart

  addProductCart()
  document.querySelectorAll('.card-size').forEach(b => b.classList.remove('active'));
  let jumlah = document.querySelectorAll('#jumlah');
  jumlah.forEach(b=> b.value = 0);

  jumlah = 0;
  if(jumlah < 1){
    document.querySelectorAll('.p-stok').forEach(e => e.textContent = `Stok: 0`)
   }

  })



  }








document.addEventListener("DOMContentLoaded", async () => {
    await getProductDetail();
    await getProductSizes(id);
});