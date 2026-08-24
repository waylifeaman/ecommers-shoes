function showAlert(message, type = "info", onClose) {
  // Hapus alert lama kalau masih ada (biar gak numpuk)
  const existing = document.querySelector(".alert-overlay");
  if (existing) existing.remove();

  const icons = {
    error: "!",
    success: "✓",
    info: "i",
  };

  const overlay = document.createElement("div");
  overlay.className = "alert-overlay";
  overlay.innerHTML = `
    <div class="alert-box ${type}">
      <div class="alert-icon">${icons[type] || icons.info}</div>
      <p class="alert-message">${message}</p>
      <button class="alert-btn">OK</button>
    </div>
  `;

  document.body.appendChild(overlay);

  // trigger transisi (perlu delay 1 frame biar animasi jalan)
  requestAnimationFrame(() => overlay.classList.add("active"));

  function closeAlert() {
    overlay.classList.remove("active");
    setTimeout(() => {overlay.remove();
    if(onClose) onClose()
    
  },200); // tunggu animasi selesai baru dihapus
  }

  overlay.querySelector(".alert-btn").addEventListener("click", closeAlert);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeAlert(); // klik di luar box juga nutup
  });
}