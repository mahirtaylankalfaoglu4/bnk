// Sayfa yüklendiğinde verileri getir
document.addEventListener('DOMContentLoaded', function() {
    loadTransactionData();
});

function loadTransactionData() {
    try {
        // hesapHareketleri.js dosyasından verileri al
        const data = getHesapHareketleri();
        const lastUpdate = sonGuncelleme;
        
        // Son güncelleme zamanını göster
        document.getElementById('lastUpdate').textContent = `Son Güncelleme: ${lastUpdate}`;
        
        // Tabloyu doldur
        populateTable(data);
        
    } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        document.getElementById('tableBody').innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: red;">
                    Veri yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyin.
                </td>
            </tr>
        `;
    }
}

function populateTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center;">Henüz işlem bulunmuyor.</td>
            </tr>
        `;
        return;
    }
    
    // Toplam bakiyeyi hesapla (son işlemin bakiyesi)
    const totalBalance = data[0].bakiye;
    document.getElementById('totalBalance').textContent = totalBalance;
    
    // Her bir işlemi tabloya ekle
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        
        // Gelir işlemlerini yeşil, giderleri kırmızı yap
        const amountColor = item.tutar.includes('+') ? '#28a745' : '#dc3545';
        const amountBg = item.tutar.includes('+') ? '#d4edda' : '#f8d7da';
        
        row.innerHTML = `
            <td>${item.tarih}</td>
            <td><strong>${item.aciklama}</strong></td>
            <td>${item.islem}</td>
            <td style="color: ${amountColor}; background-color: ${amountBg}; font-weight: bold;">
                ${item.tutar}
            </td>
            <td><strong>${item.bakiye}</strong></td>
        `;
        
        // Satıra animasyon ekle
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        tableBody.appendChild(row);
        
        // Animasyon
        setTimeout(() => {
            row.style.transition = 'all 0.5s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Her 30 saniyede bir verileri yenile
setInterval(loadTransactionData, 30000);