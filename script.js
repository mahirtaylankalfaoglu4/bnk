const tableBody = document.getElementById("tableBody");
const totalBalance = document.getElementById("totalBalance");
const lastUpdate = document.getElementById("lastUpdate");

// GitHub raw JS dosya URL'si
const url = "https://raw.githubusercontent.com/mahirtaylankalfaoglu4/bnk/main/hesap_hareketleri.js";

fetch(url)
    .then(response => response.text())
    .then(jsCode => {
        // JS kodunu çalıştırarak hesapHareketleri ve sonGuncelleme değişkenlerini oluştur
        eval(jsCode);

        // Tabloyu temizle
        tableBody.innerHTML = "";

        if (!hesapHareketleri || hesapHareketleri.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center">İşlem yok</td></tr>`;
            totalBalance.textContent = "0 TL";
        } else {
            // Son bakiyeyi al
            const sonBakiye = hesapHareketleri[hesapHareketleri.length - 1][4];
            totalBalance.textContent = sonBakiye;

            // Son güncelleme
            lastUpdate.textContent = `Son Güncelleme: ${sonGuncelleme}`;

            // Tablodaki verileri ekle
            hesapHareketleri.forEach(hareket => {
                const tr = document.createElement("tr");
                hareket.forEach(item => {
                    const td = document.createElement("td");
                    td.innerHTML = item.replace(/\n/g, "<br>");
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        }
    })
    .catch(err => {
        console.error("Veri yüklenemedi:", err);
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center">Veri yüklenemedi</td></tr>`;
        totalBalance.textContent = "-";
        lastUpdate.textContent = "-";
    });
