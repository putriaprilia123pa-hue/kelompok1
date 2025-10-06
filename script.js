// =======================================================
// SCRIPT.JS UNTUK MULTI-PAGE APPLICATION (MPA)
// =======================================================

// --- DATA CONTOH (Bisa juga dipisah ke file data.js sendiri jika makin kompleks) ---
const dataBerita = [
    { id: 1, judul: "Berita terkini tanggal 1", tanggal: "2021-03-01 09:07:24", status: "publish", user: "ilmuweb@gmail.com" },
    { id: 2, judul: "Berita terkini tanggal 28", tanggal: "2021-02-28 23:50:02", status: "publish", user: "ilmuweb@gmail.com" },
    { id: 3, judul: "Judul berita hari ketujuh", tanggal: "2021-02-28 16:38:52", status: "publish", user: "ilmuweb@gmail.com" },
    { id: 4, judul: "Judul berita hari keenam", tanggal: "2021-02-28 16:32:21", status: "draft", user: "ilmuweb@gmail.com" },
];
const dataPolling = [
    { id: 1, pertanyaan: "Siapa calon presiden pilihan Anda di 2029?", status: "active" },
    { id: 2, pertanyaan: "Apakah Anda setuju dengan kebijakan baru pemerintah?", status: "active" },
    { id: 3, pertanyaan: "Platform media sosial apa yang paling sering Anda gunakan?", status: "closed" },
];
let statusChartInstance = null;

// --- EVENT LISTENER UTAMA ---
// Menjalankan kode setelah seluruh halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Fungsi ini dijalankan di setiap halaman
    setupMobileMenuToggle();

    // Cek halaman mana yang aktif, lalu jalankan fungsi spesifik untuk halaman itu
    if (document.getElementById('page-dashboard')) {
        updateDashboard();
    }
    if (document.getElementById('page-berita')) {
        renderBeritaTable();
    }
    if (document.getElementById('page-polling')) {
        renderPollingTable();
    }
});

// --- FUNGSI BERSAMA ---
// Fungsi ini dibutuhkan di semua halaman
function setupMobileMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('show'));
    }
}

// --- FUNGSI UNTUK DASHBOARD ---
function updateDashboard() {
    const totalBerita = dataBerita.length;
    const beritaPublish = dataBerita.filter(item => item.status === 'publish').length;
    const beritaDraft = totalBerita - beritaPublish;
    document.getElementById('total-berita').innerText = totalBerita;
    document.getElementById('berita-publish').innerText = beritaPublish;
    document.getElementById('berita-draft').innerText = beritaDraft;
    renderStatusChart(beritaPublish, beritaDraft);
}
function renderStatusChart(publishCount, draftCount) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    if (statusChartInstance) statusChartInstance.destroy();
    statusChartInstance = new Chart(ctx, { type: 'doughnut', data: { labels: ['Publish', 'Draft'], datasets: [{ data: [publishCount, draftCount], backgroundColor: ['#2eb85c', '#f9b115'], borderColor: ['#ffffff'], borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } } });
}

// --- FUNGSI UNTUK HALAMAN BERITA ---
function renderBeritaTable() {
    const tableBody = document.querySelector("#berita-table tbody");
    if (!tableBody) return;
    tableBody.innerHTML = "";
    dataBerita.forEach((item, index) => {
        tableBody.innerHTML += `<tr data-id="${item.id}"><td>${index + 1}</td><td>${item.judul}</td><td>${item.tanggal}</td><td><span class="status ${item.status === 'publish' ? 'status-publish' : 'status-draft'}">${item.status}</span></td><td>${item.user}</td><td class="action-buttons"><a href="#" class="btn btn-success" onclick="showViewModal(${item.id})">View</a> <a href="#" class="btn btn-warning" onclick="showEditModal(${item.id})">Edit</a> <a href="#" class="btn btn-danger" onclick="showDeleteModal(${item.id})">Delete</a></td></tr>`;
    });
}

// --- FUNGSI UNTUK HALAMAN POLLING ---
function renderPollingTable() {
    const tableBody = document.querySelector("#polling-table tbody");
    if (!tableBody) return;
    tableBody.innerHTML = "";
    dataPolling.forEach((item, index) => {
        tableBody.innerHTML += `<tr data-id="${item.id}"><td>${index + 1}</td><td>${item.pertanyaan}</td><td><span class="status ${item.status === 'active' ? 'status-active' : 'status-closed'}">${item.status}</span></td><td class="action-buttons"><a href="#" class="btn btn-success" onclick="showViewPollingModal(${item.id})">View</a> <a href="#" class="btn btn-warning" onclick="showEditPollingModal(${item.id})">Edit</a> <a href="#" class="btn btn-danger" onclick="showDeletePollingModal(${item.id})">Delete</a></td></tr>`;
    });
}

// --- MODAL BERSAMA (digunakan di halaman Berita & Polling) ---
const modal = document.getElementById('myModal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalFooter = document.getElementById('modal-footer');
function openModal() { if(modal) modal.style.display = "block"; }
function closeModal() { if(modal) modal.style.display = "none"; }
window.onclick = function(event) { if (event.target == modal) closeModal(); }

// --- FUNGSI MODAL UNTUK BERITA ---
function showAddModal() {
    modalTitle.innerText = "Tambah Berita Baru";
    modalBody.innerHTML = `<div class="modal-form-group"><label>Judul Berita</label><input type="text" id="judulBerita" placeholder="Masukkan judul..."></div><div class="modal-form-group"><label>Status</label><select id="statusBerita"><option value="publish">Publish</option><option value="draft">Draft</option></select></div>`;
    modalFooter.innerHTML = `<button class="btn" onclick="closeModal()">Batal</button><button class="btn btn-primary" onclick="tambahData()">Simpan</button>`;
    openModal();
}
function tambahData() {
    const judul = document.getElementById('judulBerita').value;
    const status = document.getElementById('statusBerita').value;
    if (judul) {
        dataBerita.push({ id: Date.now(), judul: judul, tanggal: new Date().toISOString().slice(0, 19).replace('T', ' '), status: status, user: "ilmuweb@gmail.com" });
        renderBeritaTable();
        closeModal();
    } else { alert("Judul tidak boleh kosong!"); }
}
function showViewModal(id) {
    const item = dataBerita.find(d => d.id === id);
    if(item) {
        modalTitle.innerText = "Detail Berita";
        modalBody.innerHTML = `<p><strong>ID:</strong> ${item.id}</p><p><strong>Judul:</strong> ${item.judul}</p><p><strong>Tanggal:</strong> ${item.tanggal}</p><p><strong>Status:</strong> ${item.status}</p>`;
        modalFooter.innerHTML = `<button class="btn btn-danger" onclick="closeModal()">Tutup</button>`;
        openModal();
    }
}
function showEditModal(id) {
    const item = dataBerita.find(d => d.id === id);
    if(item) {
        modalTitle.innerText = "Edit Berita";
        modalBody.innerHTML = `<div class="modal-form-group"><label>Judul Berita</label><input type="text" id="editJudulBerita" value="${item.judul}"></div><div class="modal-form-group"><label>Status</label><select id="editStatusBerita"><option value="publish" ${item.status === 'publish' ? 'selected' : ''}>Publish</option><option value="draft" ${item.status === 'draft' ? 'selected' : ''}>Draft</option></select></div>`;
        modalFooter.innerHTML = `<button class="btn" onclick="closeModal()">Batal</button><button class="btn btn-primary" onclick="editData(${id})">Update</button>`;
        openModal();
    }
}
function editData(id) {
    const judulBaru = document.getElementById('editJudulBerita').value;
    const statusBaru = document.getElementById('editStatusBerita').value;
    const itemIndex = dataBerita.findIndex(d => d.id === id);
    if (itemIndex > -1 && judulBaru) {
        dataBerita[itemIndex].judul = judulBaru;
        dataBerita[itemIndex].status = statusBaru;
        renderBeritaTable();
        closeModal();
    } else { alert("Judul tidak boleh kosong!"); }
}
function showDeleteModal(id) {
    const item = dataBerita.find(d => d.id === id);
    if (item) {
        modalTitle.innerText = "Konfirmasi Hapus";
        modalBody.innerHTML = `<p>Anda yakin ingin menghapus berita: <strong>"${item.judul}"</strong>?</p>`;
        modalFooter.innerHTML = `<button class="btn" onclick="closeModal()">Batal</button><button class="btn btn-danger" onclick="hapusData(${id})">Hapus</button>`;
        openModal();
    }
}
function hapusData(id) {
    const itemIndex = dataBerita.findIndex(d => d.id === id);
    if (itemIndex > -1) {
        dataBerita.splice(itemIndex, 1);
        renderBeritaTable();
        closeModal();
    }
}

// --- FUNGSI MODAL UNTUK POLLING ---
function showAddPollingModal() {
    modalTitle.innerText = "Tambah Polling Baru";
    modalBody.innerHTML = `<div class="modal-form-group"><label>Pertanyaan</label><input type="text" id="pertanyaanPolling" placeholder="Masukkan pertanyaan..."></div><div class="modal-form-group"><label>Status</label><select id="statusPolling"><option value="active">Active</option><option value="closed">Closed</option></select></div>`;
    modalFooter.innerHTML = `<button class="btn" onclick="closeModal()">Batal</button><button class="btn btn-primary" onclick="tambahPolling()">Simpan</button>`;
    openModal();
}
function tambahPolling() {
    const pertanyaan = document.getElementById('pertanyaanPolling').value;
    const status = document.getElementById('statusPolling').value;
    if (pertanyaan) {
        dataPolling.push({ id: Date.now(), pertanyaan: pertanyaan, status: status });
        renderPollingTable();
        closeModal();
    } else { alert("Pertanyaan tidak boleh kosong!"); }
}
function showViewPollingModal(id) {
    const item = dataPolling.find(p => p.id === id);
    if (item) {
        modalTitle.innerText = "Detail Polling";
        modalBody.innerHTML = `<p><strong>ID:</strong> ${item.id}</p><p><strong>Pertanyaan:</strong> ${item.pertanyaan}</p><p><strong>Status:</strong> ${item.status}</p>`;
        modalFooter.innerHTML = `<button class="btn btn-danger" onclick="closeModal()">Tutup</button>`;
        openModal();
    }
}
function showEditPollingModal(id) {
    const item = dataPolling.find(p => p.id === id);
    if(item) {
        modalTitle.innerText = "Edit Polling";
        modalBody.innerHTML = `<div class="modal-form-group"><label>Pertanyaan</label><input type="text" id="editPertanyaanPolling" value="${item.pertanyaan}"></div><div class="modal-form-group"><label>Status</label><select id="editStatusPolling"><option value="active" ${item.status === 'active' ? 'selected' : ''}>Active</option><option value="closed" ${item.status === 'closed' ? 'selected' : ''}>Closed</option></select></div>`;
        modalFooter.innerHTML = `<button class="btn" onclick="closeModal()">Batal</button><button class="btn btn-primary" onclick="editPolling(${id})">Update</button>`;
        openModal();
    }
}
function editPolling(id) {
    const pertanyaanBaru = document.getElementById('editPertanyaanPolling').value;
    const statusBaru = document.getElementById('editStatusPolling').value;
    const itemIndex = dataPolling.findIndex(p => p.id === id);
    if (itemIndex > -1 && pertanyaanBaru) {
        dataPolling[itemIndex].pertanyaan = pertanyaanBaru;
        dataPolling[itemIndex].status = statusBaru;
        renderPollingTable();
        closeModal();
    } else { alert("Pertanyaan tidak boleh kosong!"); }
}
function showDeletePollingModal(id) {
    const item = dataPolling.find(p => p.id === id);
    if (item) {
        modalTitle.innerText = "Konfirmasi Hapus";
        modalBody.innerHTML = `<p>Anda yakin ingin menghapus polling: <strong>"${item.pertanyaan}"</strong>?</p>`;
        modalFooter.innerHTML = `<button class="btn" onclick="closeModal()">Batal</button><button class="btn btn-danger" onclick="hapusPolling(${id})">Hapus</button>`;
        openModal();
    }
}
function hapusPolling(id) {
    const itemIndex = dataPolling.findIndex(p => p.id === id);
    if (itemIndex > -1) {
        dataPolling.splice(itemIndex, 1);
        renderPollingTable();
        closeModal();
    }
}