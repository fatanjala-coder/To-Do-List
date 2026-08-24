// Rakean Fatanjala Drajat (37) XI RPL 2
// With Great Power Comes Great Responsibility -Uncle Ben

// ========================================================

console.log("DailyBoard siap dijalankan!");

const app = document.getElementById("app");

// Header 
const kepala = document.createElement("header");
kepala.id = "kepala";
document.body.insertBefore(kepala, app);

const title = document.createElement("h1");
title.classList.add("title");
title.textContent = 'To Do List'
kepala.appendChild(title)

let nextId = 3;
let daftarTugas = [
    { id: 1, nama: "Belajar UTBK", selesai: false },
    { id: 2, nama: "Belajar JS", selesai: false },
    { id: 3, nama: "Belajar Materi PK (Penalaran Kinetik)", selesai: false },
    { id: 4, nama: "Belajar Materi PM (Penalaran Matematika)", selesai: false },
];
let daftarCatatan = [];



// Local Storage --Tugas
function simpanTugasKeStorage() {
    localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

function muatTugasDariStorage() {
    const data = localStorage.getItem("daftarTugas");
    if (data) {
        daftarTugas = JSON.parse(data);
        if (daftarTugas.length > 0) {
            nextId = Math.max(...daftarTugas.map((t) => t.id)) + 1;
        }
    }
}



// Local Storage --Catatan
function simpanCatatanKeStorage() {
    localStorage.setItem("daftarCatatan", JSON.stringify(daftarCatatan));
}

function muatCatatanDariStorage() {
    const data = localStorage.getItem("daftarCatatan");
    if (data) {
        daftarCatatan = JSON.parse(data);
    }
}



// Validasi 
function validasiInput(nilai, maxLength = 100) {
    if (nilai.trim() === "") {
        alert("Input tidak boleh kosong!");
        return false;
    }
    if (nilai.length > maxLength) {
        alert(`Input maksimal ${maxLength} karakter!`);
        return false;
    }
    return true;
}

function validasiInNote(nilai) {
    if (nilai === null) return false; 
    if (nilai.trim() === "") {
        alert("Input tidak boleh kosong!");
        return false;
    }
    return true;
}



// Function Tugas
function tambahTugas(nama) {
    if (!validasiInput(nama)) return;
    daftarTugas.push({ id: nextId++, nama, selesai: false });
    simpanTugasKeStorage();
    renderTugas();
}

function editTugas(id, namaBaru) {
    if (!validasiInput(namaBaru)) return;
    daftarTugas = daftarTugas.map((t) =>
        t.id === id ? { ...t, nama: namaBaru } : t
    );
    simpanTugasKeStorage();
    renderTugas();
}

function hapusTugas(id) {
    daftarTugas = daftarTugas.filter((t) => t.id !== id);
    simpanTugasKeStorage();
    renderTugas();
}

function toggleSelesai(id) {
    daftarTugas = daftarTugas.map((t) =>
        t.id === id ? { ...t, selesai: !t.selesai } : t
    );
    simpanTugasKeStorage();
    renderTugas();
}

function renderTugas(filter = "semua") {
    const list = document.getElementById("daftar-tugas");
    if (!list) return;
    list.innerHTML = "";

    let tugasTersaring;
    if (Array.isArray(filter)) {
        tugasTersaring = filter;
    } else {
        tugasTersaring = daftarTugas.filter((t) => {
            if (filter === "selesai") return t.selesai;
            if (filter === "belum") return !t.selesai;
            return true;
        });
    }

    tugasTersaring.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.nama + " ";
        li.style.textDecoration = item.selesai ? "line-through" : "none";
        li.style.cursor = "pointer";
        li.dataset.id = item.id;
        li.setAttribute("draggable", true);

        li.addEventListener("click", () => toggleSelesai(item.id));

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => {
            const tugasBaru = prompt("Masukkan nama tugas: ");
            if (validasiInput(tugasBaru)){
                editTugas(item.id, tugasBaru);
            }
        })
        li.appendChild(editBtn);

        li.addEventListener("dblclick", () => {
            const dblclickEdit = prompt("Masukan Nama Tugas: ");
            if (validasiInput(dblClickEdit)){
                editTugas(item.id, dblclickEdit);
            }
        });

        const tombolHapus = document.createElement("button");
        tombolHapus.classList.add('tombol-hapus');
        tombolHapus.textContent = "Hapus";
        tombolHapus.addEventListener("click", (e) => {
            e.stopPropagation();
            hapusTugas(item.id);
        });


        li.appendChild(tombolHapus);
        list.appendChild(li);
    });

    aktifkanDragDrop();
}

// Drag & Drop
function aktifkanDragDrop() {
    const list = document.getElementById("daftar-tugas");
    if (!list) return;
    const items = list.querySelectorAll("li");

    items.forEach((item) => {
        item.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", item.dataset.id);
        });

        item.addEventListener("dragover", (e) => e.preventDefault());

        item.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const idAsal = e.dataTransfer.getData("text/plain");
            const idTujuan = item.dataset.id;

        pindahkanTugas(idAsal, idTujuan);
        });
    });
}

function pindahkanTugas (idAsal, idTujuan) {
    const tugasAsal = daftarTugas.findIndex(t => t.id == idAsal);
    const tugasTujuan = daftarTugas.findIndex(t => t.id == idTujuan);

    if(tugasAsal == -1 | tugasTujuan == -1) return;
    const [item] = daftarTugas.splice(tugasAsal, 1);
    daftarTugas.splice(tugasTujuan, 0, item);

    simpanTugasKeStorage();
    renderTugas();
}

document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("daftar-tugas");
    if (!list) return;
    list.addEventListener("dragover", (e) => e.preventDefault());
    list.addEventListener("drop", (e) => {
        const idAsal = e.dataTransfer.getData("text/plain");
        console.log("Tugas dipindahkan:", idAsal);
    });
});

// Function Catatan
function tambahCatatan(isi) {
    if (!validasiInNote(isi)) return;
    daftarCatatan.push({
        id: Date.now(),
        isi,
        tanggal: new Date().toLocaleDateString(),
    });
    simpanCatatanKeStorage();
    renderCatatan();
    textArea.value = "";
}

function hapusCatatan(id) {
    daftarCatatan = daftarCatatan.filter((c) => c.id !== id);
    simpanCatatanKeStorage();
    renderCatatan();
}

function editCatatan(id, catatanBaru) {
    daftarCatatan = daftarCatatan.map((c) =>
        c.id === id ? { ...c, isi: catatanBaru } : c
    );
    simpanCatatanKeStorage();
    renderCatatan();
}

function renderCatatan() {
    const container = document.getElementById("daftar-catatan");
    if (!container) return;
    container.innerHTML = "";

    daftarCatatan.forEach((catatan) => {
        const div = document.createElement("div");
        div.className = "catatan-item";
        div.innerHTML = `
            <p>${catatan.isi}</p>
            <small>${catatan.tanggal}</small>
        `;

        const editNote = document.createElement("button");
        editNote.textContent = "Edit";
        editNote.addEventListener("click", () => {
            const noteNew = prompt("Masukkan catatan baru:", catatan.isi);
            if (validasiInNote(noteNew)) {
                editCatatan(catatan.id, noteNew);
            }
        });

        div.addEventListener("dblclick", () => {
            const dblClickEdit = prompt("Masukan Nama Catatan Baru: ");
            if (validasiInput(dblClickEdit)){
                editCatatan(catatan.id, dblClickEdit);
            }
        });

        const catatanBtnDel = document.createElement("button");
        catatanBtnDel.textContent = "Hapus";
        catatanBtnDel.addEventListener("click", () => hapusCatatan(catatan.id));

        div.appendChild(editNote);
        div.appendChild(catatanBtnDel);
        container.appendChild(div);
    });
}



// Cuaca
const WEATHER_API_KEY = "18841e293493445a30cd12b4f150c108";

async function ambilCuaca(kota) {
    const info = document.getElementById("info-cuaca");
    if (!info) return;
    info.textContent = "Memuat Info Cuaca...";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        kota
    )}&appid=${WEATHER_API_KEY}&units=metric`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kota tidak ditemukan");
        const data = await res.json();

        info.innerHTML = "";
        const pSuhu = document.createElement("p");
        pSuhu.textContent = `${data.name}: ${data.main.temp}°C`;
        const pDeskripsi = document.createElement("p");
        pDeskripsi.textContent = data.weather[0].description;
        info.append(pSuhu, pDeskripsi);
    } catch (error) {
        info.textContent = error.message;
    }
}

// Section Tugas

const tugasSection = document.createElement("section");
const subTugas = document.createElement("h3");
tugasSection.classList.add("tugas-section");
subTugas.textContent = "Tugas";
const article = document.createElement("article");
article.id = 'article';
tugasSection.appendChild(subTugas);
tugasSection.appendChild(article);
app.appendChild(tugasSection);

const input = document.createElement("input");
input.placeholder = "Tulis tugas baru...";
article.appendChild(input);

const tombolTambah = document.createElement("button");
tombolTambah.textContent = "Tambah Tugas";
article.appendChild(tombolTambah);
tombolTambah.addEventListener("click", () => {
    const nama = input.value;
    tambahTugas(nama);
    if (nama.trim() !== "") {
        input.value = "";
    }
});
// Pencarian tugas
const search = document.createElement("input");
search.placeholder = "Cari Tugas...";
search.id = "cari-tugas";
search.style.marginTop = "5px";
const bttnCari = document.createElement("button");
bttnCari.classList.add("find-button");
bttnCari.textContent = "Cari";
bttnCari.style.marginTop = "5px";
article.appendChild(search);


search.addEventListener("input", (e) => {
    const kataKunci = e.target.value.toLowerCase();
    if (kataKunci === "") {
        renderTugas("semua");
        return;
    }
    const hasil = daftarTugas.filter((t) =>
        t.nama.toLowerCase().includes(kataKunci)
);
renderTugas(hasil);
});

const daftarTugasUl = document.createElement("ul");
daftarTugasUl.id = "daftar-tugas";


const tombolSemua = document.createElement("button");
tombolSemua.textContent = "Semua";
tombolSemua.addEventListener("click", () => renderTugas("semua"));

const tombolSelesaiUI = document.createElement("button");
tombolSelesaiUI.textContent = "Selesai";
tombolSelesaiUI.addEventListener("click", () => renderTugas("selesai"));


const tombolBelum = document.createElement("button");
tombolBelum.textContent = "Belum";
tombolBelum.addEventListener("click", () => renderTugas("belum"));


// Button Tugas Section
const sectionBttn = document.createElement("article");
sectionBttn.id = 'section-bttn';
tugasSection.appendChild(daftarTugasUl);
tugasSection.appendChild(sectionBttn);
sectionBttn.appendChild(bttnCari);
sectionBttn.appendChild(tombolSemua);
sectionBttn.appendChild(tombolBelum);
sectionBttn.appendChild(tombolSelesaiUI);



// Quotes
const sectionQuotes = document.createElement("section");
const subQuotes = document.createElement("h3");
subQuotes.textContent = 'Quotes';
app.appendChild(sectionQuotes);
sectionQuotes.appendChild(subQuotes);



async function ambilKutipan() {
    const quotesEl = document.getElementById("quotes");
    if (!quotesEl) return;
    try {
        const res = await fetch("https://motivational-spark-api.vercel.app/api/quotes/random");
        const data = await res.json();
        quotesEl.textContent = data.quote;
    } catch (error) {
        console.log("Gagal mengambil kutipan:", error);
        quotesEl.textContent = "With Great Power Comes Great Responsibility";
    }
}

const quotes = document.createElement("p");
quotes.id = "quotes";
quotes.textContent = "Memuat kutipan...";
sectionQuotes.appendChild(quotes);

//refresh
const refreshQuotes = document.createElement("button");
refreshQuotes.textContent  = 'Refresh Quotes';
refreshQuotes.addEventListener("click", () => {
    ambilKutipan();
});
sectionQuotes.appendChild(refreshQuotes);


// Dark Mode/Light Mode
function terapkanTemaTersimpan() {
    if (localStorage.getItem("tema") === "gelap") {
        document.body.classList.add("dark-mode");
    }
    perbaruiTeksToggleTema();
}

function perbaruiTeksToggleTema() {
    const gelap = document.body.classList.contains("dark-mode");
    toggleBtn.textContent = gelap ? "Light Mode" : "Dark Mode";
}

const toggleBtn = document.createElement("button");
toggleBtn.id = "toggle-tema";
toggleBtn.style.cursor = 'pointer';
toggleBtn.textContent = "Dark Mode";
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const modeAktif = document.body.classList.contains("dark-mode");
    localStorage.setItem("tema", modeAktif ? "gelap" : "terang");
    perbaruiTeksToggleTema();
});
kepala.appendChild(toggleBtn);









// Section Catatan
const catatanSection = document.createElement("section");
const subCatatan = document.createElement("h3");
subCatatan.textContent = "Catatan";
catatanSection.appendChild(subCatatan);

const textArea = document.createElement("textarea");
catatanSection.appendChild(textArea);

const bttnCatatan = document.createElement("button");
bttnCatatan.textContent = "Tambah Catatan";
bttnCatatan.addEventListener("click", () => {
    tambahCatatan(textArea.value.trim());
});
catatanSection.appendChild(bttnCatatan);

const daftarCatatanContainer = document.createElement("div");
daftarCatatanContainer.id = "daftar-catatan";
catatanSection.appendChild(daftarCatatanContainer);
app.appendChild(catatanSection);

const garisCatatan = document.createElement("hr");
catatanSection.appendChild(garisCatatan);

// Section cuaca

const cuacaSection = document.createElement("section");
const subCuaca = document.createElement("h3");
subCuaca.textContent = "Cuaca";
cuacaSection.appendChild(subCuaca);

const infoCuaca = document.createElement("article");
const subInfo = document.createElement("h4");
subInfo.textContent = "Info Cuaca";
const inputKota = document.createElement("input");
inputKota.placeholder = "Input Kota";
const tombolCuaca = document.createElement("button");
tombolCuaca.textContent = "Cek";
tombolCuaca.addEventListener("click", () => {
    const kota = inputKota.value.trim();
    if (!validasiInput(kota, 100)) return;
    ambilCuaca(kota);
});

const info = document.createElement("p");
info.id = "info-cuaca";
info.textContent = "Memuat Info Cuaca...";

infoCuaca.append(subInfo);
infoCuaca.appendChild(inputKota);
infoCuaca.appendChild(tombolCuaca);
infoCuaca.appendChild(info);
cuacaSection.appendChild(infoCuaca);
app.appendChild(cuacaSection);

const garisCuaca = document.createElement("hr");
cuacaSection.appendChild(garisCuaca);


const status = document.createElement("p");
app.appendChild(status);

async function muatSemuaWidget() {
    status.textContent = "Memuat data...";
    await Promise.all([ambilKutipan(), ambilCuaca("New York")]);
    status.textContent = "Data berhasil dimuat";
}


// Render 
muatTugasDariStorage();
muatCatatanDariStorage();
terapkanTemaTersimpan();
renderTugas();
renderCatatan();
muatSemuaWidget();


for (const t of daftarTugas) {
    console.log(`Nama: ${t.nama}`);
}

//Copyright
const footer = document.createElement("footer");
footer.id = 'footer';
const wmLine = document.createElement("hr");
footer.style.marginTop = "10px";
const copyright = document.createElement("p");
copyright.classList.add("copyright");
copyright.textContent = '© 2026 Rakean Fatanjala Drajat. Crafted with passion and lots of coffee.';
footer.appendChild(wmLine);
footer.appendChild(copyright);
