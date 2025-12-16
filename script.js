// hesap_hareketleri.js'den veri al
const hareketler = getHesapHareketleri();

// HTML elementlerini seç
const tableBody = document.getElementById("tableBody");
const totalBalance = document.getElementById("totalBalance");
const lastUpdate = document.getElementById("lastUpdate");

// Tabloyu temizle
tableBody.innerHTML = "";

// Veri yoksa
if (!hareketler || hareketler.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center">İşlem yok</td></tr>`;
    totalBalance.textContent = "0 TL";
} else {
    // Son bakiyeyi al
    const sonBakiye = hareketler[hareketler.length - 1][4];
    totalBalance.textContent = sonBakiye;

    // Son güncelleme
    lastUpdate.textContent = `Son Güncelleme: ${sonGuncelleme}`;

    // Tablodaki her satırı oluştur
    hareketler.forEach(hareket => {
        const tr = document.createElement("tr");
        hareket.forEach(item => {
            const td = document.createElement("td");
            td.innerHTML = item.replace(/\n/g, "<br>"); // Satır atlamaları için
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}
