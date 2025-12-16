import React from "react";
import { hesapHareketleri, sonGuncelleme } from "../hesap_hareketleri";

const HesapHareketleriTablo = () => {
  // Son bakiyeyi son satırdan al
  const sonBakiye = hesapHareketleri.length > 0 ? hesapHareketleri[hesapHareketleri.length - 1][4] : "0 TL";

  return (
    <div className="container">
      <h1>Hesap Hareketleri</h1>
      <div className="summary">
        <div className="balance-card">
          <h2>Toplam Bakiye</h2>
          <p className="balance">{sonBakiye}</p>
        </div>
        <div className="last-update">
          <p>Son Güncelleme: {sonGuncelleme}</p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Gönderen</th>
              <th>İşlem</th>
              <th>Tutar</th>
              <th>Bakiye</th>
            </tr>
          </thead>
          <tbody>
            {hesapHareketleri.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  İşlem yok
                </td>
              </tr>
            ) : (
              hesapHareketleri.map((hareket, idx) => (
                <tr key={idx}>
                  {hareket.map((kolon, i) => (
                    <td key={i} dangerouslySetInnerHTML={{ __html: kolon.replace(/\n/g, "<br>") }} />
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HesapHareketleriTablo;
