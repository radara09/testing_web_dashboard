// Ganti URL di bawah ini dengan URL Web App kamu dari Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyWZt6mcBOatlaYxcH_xJrwMEwlP64XhoHi2Zh-D_9CT2SvYBF5Wez-9S1E9nkArmgb/exec";

// Ambil semua data untuk dashboard summary
async function getAllData() {
  const res = await fetch(SCRIPT_URL);
  const data = await res.json();

  document.getElementById('total-ac').textContent = data.length;
  document.getElementById('ac-broken').textContent = data.filter(d => d["Kondisi Terakhir"] !== "Bagus").length;
  document.getElementById('ac-delay').textContent = data.filter(d => {
    const svc = new Date(d["Service Terakhir"]);
    const diff = (new Date() - svc) / (1000 * 60 * 60 * 24);
    return diff > 90;
  }).length;
  const teknisiUnik = new Set(data.map(d => d["Teknisi"])).size;
  document.getElementById('total-tech').textContent = teknisiUnik;
}

// Fungsi cari berdasarkan ID
async function cariAC() {
  const id = document.getElementById('searchId').value.trim();
  if (!id) return alert('Masukkan ID AC dulu!');

  const res = await fetch(`${SCRIPT_URL}?id=${id}`);
  const data = await res.json();

  if (!data || !data["ID_AC"]) {
    alert('Data tidak ditemukan!');
    return;
  }

  // Update detail
  document.getElementById('ac-id-display').textContent = data["ID_AC"];
  document.getElementById('ac-detail').innerHTML = `
    <p><strong>Kode AC:</strong> ${data["ID_AC"]}</p>
    <p><strong>Lokasi:</strong> ${data["Lokasi"]}</p>
    <p><strong>Merek:</strong> ${data["Merek"]}</p>
    <p><strong>Kondisi Terakhir:</strong> ${data["Kondisi Terakhir"]}</p>
    <p><strong>Service Terakhir:</strong> ${data["Service Terakhir"]}</p>
    <p><strong>Teknisi:</strong> ${data["Teknisi"]}</p>
    <p><strong>Jadwal Berikut:</strong> ${data["Jadwal Berikut"]}</p>
  `;

  document.getElementById('hasilCari').innerHTML = `
    <p><strong>Tekanan Freon:</strong> ${data["Tekanan Freon"]}</p>
    <p><strong>Suhu Keluar:</strong> ${data["Suhu Keluar"]}</p>
    <p><strong>Ampere Kompresor:</strong> ${data["Ampere Kompresor"]}</p>
    <p><strong>Kondisi Filter:</strong> ${data["Kondisi Filter"]}</p>
  `;

  // Tombol foto dummy
  const btnFoto = document.getElementById('btnFoto');
  btnFoto.onclick = () => window.open("https://example.com/foto.jpg", "_blank");
}

// Event listener
document.getElementById('btnCari').addEventListener('click', cariAC);

// Jalankan saat pertama load
getAllData();
