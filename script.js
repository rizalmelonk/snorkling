/* =========================================
   PIAN GUIDE JAVASCRIPT
========================================= */

const WA = "6287862232321";

/* ===============================
   FORMAT RUPIAH
================================ */

function rupiah(angka){
    return "Rp " + angka.toLocaleString("id-ID");
}


/* ===============================
   HARGA SNORKELING
================================ */

function harga(jumlah){

    if(jumlah <= 2){
        return 2450000;
    }

    if(jumlah === 3){
        return 1750000;
    }

    if(jumlah === 4){
        return 1375000;
    }

    if(jumlah <= 6){
        return 1150000;
    }

    return null;
}


/* ===============================
   KALKULATOR
================================ */

const jumlahInput = document.getElementById("jumlah");
const hargaPerOrang = document.getElementById("hargaPerOrang");
const totalHarga = document.getElementById("totalHarga");

function hitungHarga(){

    if(!jumlahInput) return;

    let jumlah = parseInt(jumlahInput.value) || 1;

    if(jumlah < 1){
        jumlah = 1;
        jumlahInput.value = 1;
    }

    const harga = harga(jumlah);

    if(harga === null){

        if(hargaPerOrang){
            hargaPerOrang.textContent = "Hubungi kami";
        }

        if(totalHarga){
            totalHarga.textContent = "Tanya harga";
        }

        return;
    }

    if(hargaPerOrang){
        hargaPerOrang.textContent = rupiah(harga);
    }

    if(totalHarga){
        totalHarga.textContent = rupiah(Math.max(jumlah,2) * harga);
    }
}

if(jumlahInput){
    jumlahInput.addEventListener("input", hitungHarga);
    hitungHarga();
}


/* ===============================
   LIGHTBOX GALERI
================================ */

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");

document.querySelectorAll(".gallery-image").forEach(function(image){

    image.addEventListener("click", function(){

        if(!lightbox) return;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        lightbox.classList.add("open");
    });

});


if(lightbox){

    lightbox.addEventListener("click", function(){
        lightbox.classList.remove("open");
    });

}

document.addEventListener("keydown", function(e){

    if(e.key === "Escape" && lightbox){
        lightbox.classList.remove("open");
    }

});


/* ===============================
   FORM PEMESANAN
================================ */

const nama = document.getElementById("nama");
const paket = document.getElementById("paket");
const tanggal = document.getElementById("tanggal");
const jumlahOrang = document.getElementById("jumlahOrang");
const catatan = document.getElementById("catatan");

const estimasi = document.getElementById("estimasi");
const keterangan = document.getElementById("keterangan");
const error = document.getElementById("error");
const tombolKirim = document.getElementById("kirim");


function hitungPesanan(){

    if(!jumlahOrang || !paket) return;

    const jumlah = Math.max(
        1,
        parseInt(jumlahOrang.value) || 1
    );

    let total = 0;
    let ket = "";

    if(paket.value === "Price list"){

        const hargaSatuan = harga(jumlah);

        if(hargaSatuan === null){

            estimasi.textContent = "Tanya harga";
            keterangan.textContent =
                "Untuk lebih dari 6 orang silakan hubungi kami.";

            return;
        }

        total = Math.max(jumlah,2) * hargaSatuan;

        ket = rupiah(hargaSatuan) + " per orang";

    }

    else if(
        paket.value === "3 Gili Sekotong" ||
        paket.value === "Secret Gilis Lombok"
    ){

        if(jumlah < 5){

            estimasi.textContent = "Minimal 5 orang";
            keterangan.textContent =
                "Paket ini tersedia mulai dari 5 orang.";

            return;
        }

        total = jumlah * 300000;

        ket = "Rp 300.000 per orang";
    }

    if(estimasi){
        estimasi.textContent = rupiah(total);
    }

    if(keterangan){
        keterangan.textContent = ket;
    }
}


function tanggalIndonesia(value){

    if(!value){
        return "-";
    }

    return new Date(value + "T00:00:00")
        .toLocaleDateString("id-ID",{
            weekday:"long",
            day:"numeric",
            month:"long",
            year:"numeric"
        });
}


function updateWhatsApp(){

    if(!tombolKirim) return;

    const jumlah =
        Math.max(
            1,
            parseInt(jumlahOrang.value) || 1
        );

    let totalText =
        estimasi ? estimasi.textContent : "-";

    let pesan = [
        "Halo PIAN GUIDE, saya ingin memesan trip snorkeling.",
        "",
        "Nama: " + (nama.value.trim() || "-"),
        "Paket: " + (paket.value || "-"),
        "Tanggal: " + tanggalIndonesia(tanggal.value),
        "Jumlah orang: " + jumlah,
        "Perkiraan total: " + totalText,
        "Catatan: " + (catatan.value.trim() || "-"),
        "",
        "Apakah tanggal tersebut masih tersedia?"
    ].join("\n");

    tombolKirim.href =
        "https://wa.me/" +
        WA +
        "?text=" +
        encodeURIComponent(pesan);
}


[
    nama,
    paket,
    tanggal,
    jumlahOrang,
    catatan
].forEach(function(element){

    if(element){

        element.addEventListener("input",function(){
            hitungPesanan();
            updateWhatsApp();
        });

        element.addEventListener("change",function(){
            hitungPesanan();
            updateWhatsApp();
        });
    }

});


if(tombolKirim){

    tombolKirim.addEventListener("click",function(e){

        if(!nama.value.trim()){

            e.preventDefault();

            error.textContent =
                "Silakan isi nama terlebih dahulu.";

            nama.focus();

            return;
        }

        if(!tanggal.value){

            e.preventDefault();

            error.textContent =
                "Silakan pilih tanggal trip.";

            tanggal.focus();

            return;
        }

        error.textContent = "";
    });

}


/* ===============================
   TANGGAL MINIMAL HARI INI
================================ */

if(tanggal){

    const today = new Date();

    const tahun = today.getFullYear();

    const bulan = String(
        today.getMonth()+1
    ).padStart(2,"0");

    const hari = String(
        today.getDate()
    ).padStart(2,"0");

    tanggal.min =
        `${tahun}-${bulan}-${hari}`;
}


hitungPesanan();
updateWhatsApp();
