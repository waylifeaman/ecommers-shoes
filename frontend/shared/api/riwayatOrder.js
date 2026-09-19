const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const endpoint = "https://ecommers-shoes.vercel.app/data-order"
let allOrder = []


// GET data order 
async function getDataRiwayatOrder(userId) {
    try{
        const res = await fetch(`${endpoint}/user/${userId}`)
        if(!res.ok){
            throw new Error("Order Tidak ditemukan");
        }

        return await res.json();
    }catch(err){
        console.log(err.message);
        return null
    }
}
