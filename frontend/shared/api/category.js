
const endpointCategory  = "http://localhost:3000/data-category";
// GET
async function getDataCategory() {
    const res = await fetch(endpointCategory , {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (!res.ok) {
        throw new Error("Gagal mengambil data kategori");
    }
    return await res.json();
}
// POST
async function addDataCategory(data) {
    const res = await fetch(endpointCategory , {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error("Gagal menambahkan kategori");
    }

    return await res.json();
}
// PUT
async function editData(id, data) {
    const res = await fetch(`${endpointCategory }/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error("Gagal mengedit kategori");
    }

    return await res.json();
}
async function deleteData(id) {
  const res = await fetch(`${endpointCategory }/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Gagal menghapus kategori");
  }
  return await res.json();
}