
const modalOverlay = document.querySelector("#modalOverlay");
const modalTitle = document.querySelector("#modalTitle");
const formCategory = document.querySelector("#formCategory");
const categoryIdInput = document.querySelector("#categoryId");
const categoryNameInput = document.querySelector("#categoryName");

const btnCloseModal = document.querySelector("#btnCloseModal");
const btnCancel = document.querySelector("#btnCancel");
const tambahCategory = document.querySelector("#tambahCategory");


// Render data pada tabel
let  render = async function () {

    let i = 1;
    let res = await getDataCategory()
    const TabelCategori = document.querySelector("#data-category");
    TabelCategori.innerHTML = "";
    res.forEach((item)=>{
      const elTr = document.createElement('tr');
      const TdId = document.createElement('td');
      TdId.textContent = i++;
      const TdName = document.createElement('td');
      TdName.textContent = item.name;
      const tdAction = document.createElement('td');
      const btnEdit = document.createElement('button');
      btnEdit.textContent = "Edit";
      btnEdit.addEventListener('click',()=>{editCategory(item)});
      const btnHapus =document.createElement('button');
      btnHapus.textContent = "Hapus";
      btnHapus.addEventListener('click', ()=>{hapusCategory(item.id)});
      tdAction.append(btnEdit, btnHapus);
      elTr.append(TdId, TdName, tdAction);
      TabelCategori.append(elTr);    
    })
   
} 

function addCategory(){
    modalTitle.textContent = "Tambah Data Category";
    categoryIdInput.value = "";
    categoryNameInput.value = "";
    modalOverlay.classList.remove("hidden");
}

function editCategory(item){
    modalTitle.textContent="Edit Data Category";
    categoryIdInput.value=item.id;
    categoryNameInput.value=item.name;
    modalOverlay.classList.remove('hidden');
}
async function hapusCategory(id){
    let konfirm = confirm("Yakin anda hapus data ini !!");
    if(!konfirm)return;
    try{
        await deleteData(id);        
        render();
    }
    catch(err){
        showAlert("data gagal terhapus");
        return (err.message);
    }
}

function closecard(){
    modalOverlay.classList.add('hidden');
    formCategory.reset();
    categoryIdInput.value = "";
}
btnCloseModal.addEventListener("click", closecard);
btnCancel.addEventListener("click", closecard);
tambahCategory.addEventListener("click", addCategory);

formCategory.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = categoryIdInput.value;
  const name = categoryNameInput.value.trim();
  if (!name) {
    alert("Nama kategori tidak boleh kosong!");
    return;
  }
  try {
    if (id) {
      await editData(id, { name });  // sekarang manggil fungsi PUT yang benar
    } else {
      await addDataCategory({ name });
    }
    closecard();
    render();
  } catch (err) {
    alert(err.message);
  }
});






document.addEventListener("DOMContentLoaded", render);