from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json
from datetime import datetime

class VeriBotu:
    def __init__(self):
        self.driver = webdriver.Chrome()
        self.bekle = WebDriverWait(self.driver, 10)
        self.eski_veriler = []
        self.dosya_adi = "hesap_hareketleri.js"
        
    def giris_yap(self):
        """Siteye giriş yap"""
        self.driver.get("https://sube.garantibbva.com.tr/isube/login/login/passwordentrypersonal-tr")
        
        # Giriş bilgilerini doldur
        self.bekle.until(EC.presence_of_element_located((By.XPATH, '//*[@id="custno"]'))).send_keys("21308244194")
        self.bekle.until(EC.presence_of_element_located((By.XPATH, '//*[@id="password"]'))).send_keys("827193")
        self.bekle.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="formSubmit"]'))).click()
        
        time.sleep(2)
    
    def adimlari_takip_et(self):
        """Tüm adımları sırayla uygula"""
        # 1. Financial Status alanına tıkla
        self.bekle.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="financialStatusPartialBlockArea"]/div[1]/table/tbody/tr/td[1]/div'))).click()
        time.sleep(2)
        
        # 2. Investment Account Grid'e tıkla
        self.bekle.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="investmentAccountGrid"]/tbody/tr[1]/td[2]'))).click()
        time.sleep(2)
        
        # 3. Date range'e tıkla ve 8. seçeneği seç
        self._tarih_araligi_sec()
        
        # 4. Gelişmiş filtreleme
        self._gelismis_filtre_uygula()
        
        # 5. Update butonuna tıkla
        self.bekle.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="updateSubmitButton"]'))).click()
        time.sleep(3)
    
    def _tarih_araligi_sec(self):
        self.bekle.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="dateRangeText"]/div/div/div/div/div/div'))).click()
        time.sleep(1)
        self.bekle.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="dateRangeText"]/div/div/div/div/div/ul/li[8]/a'))).click()
        time.sleep(2)
    
    def _gelismis_filtre_uygula(self):
        try:
            self.bekle.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="advancefilterId"]/span'))).click()
            time.sleep(1)
            self.bekle.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="advancefilter"]/div[2]/div[1]/div[1]/div/div/div/div/div/div/span'))).click()
            time.sleep(1)
            self.bekle.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="advancefilter"]/div[2]/div[1]/div[1]/div/div/div/div/div/ul/li[3]/a'))).click()
            time.sleep(2)
            print("Gelişmiş filtreleme uygulandı.")
        except Exception as e:
            print(f"Gelişmiş filtreleme hatası: {e}")
    
    def verileri_al(self):
        """Tablodaki tüm verileri al"""
        try:
            tablo = self.bekle.until(EC.presence_of_element_located((By.XPATH, '//*[@id="myAccountActivitiesGrid"]/tbody')))
            satirlar = tablo.find_elements(By.TAG_NAME, "tr")
            
            veriler = []
            for satir in satirlar:
                hucreler = satir.find_elements(By.TAG_NAME, "td")
                satir_verisi = [hucre.text for hucre in hucreler]
                veriler.append(satir_verisi)
            return veriler
        except Exception as e:
            print(f"Veri alma hatası: {e}")
            return []
    
    def js_dosyasi_olustur(self, veriler):
        """Verileri React için ES Module formatında JS dosyası olarak kaydet"""
        zaman = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        js_icerik = f"""
// Hesap Hareketleri - Güncelleme: {zaman}
export const hesapHareketleri = {json.dumps(veriler, ensure_ascii=False, indent=2)};
export const sonGuncelleme = "{zaman}";
"""
        with open(self.dosya_adi, 'w', encoding='utf-8') as f:
            f.write(js_icerik)
        print(f"Veriler {self.dosya_adi} dosyasına kaydedildi - {zaman}")
    
    def veri_degisti_mi(self, yeni_veriler):
        if self.eski_veriler != yeni_veriler:
            self.eski_veriler = yeni_veriler
            return True
        return False
    
    def guncelleme_yap(self):
        try:
            self._gelismis_filtre_uygula()
            self.bekle.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="updateSubmitButton"]'))).click()
            time.sleep(3)
            yeni_veriler = self.verileri_al()
            if self.veri_degisti_mi(yeni_veriler):
                print("Yeni veri bulundu! Güncelleniyor...")
                self.js_dosyasi_olustur(yeni_veriler)
                return True
            else:
                print("Veri değişmedi.")
                return False
        except Exception as e:
            print(f"Güncelleme hatası: {e}")
            return False
    
    def calistir(self):
        try:
            self.giris_yap()
            self.adimlari_takip_et()
            
            veriler = self.verileri_al()
            self.js_dosyasi_olustur(veriler)
            self.eski_veriler = veriler
            
            while True:
                try:
                    time.sleep(25)
                    self.guncelleme_yap()
                except KeyboardInterrupt:
                    print("Durduruldu.")
                    break
                except Exception as e:
                    print(f"Hata oluştu: {e}")
                    continue
        except Exception as e:
            print(f"Büyük hata: {e}")
        finally:
            self.driver.quit()

if __name__ == "__main__":
    bot = VeriBotu()
    bot.calistir()
