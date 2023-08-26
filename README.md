# RESTful API BBM Jakarta (Jabodetabek)

RESTful API ini dibuat dengan bergantung kepada website [isibens.in](https://isibens.in/) yang bertujuan untuk mempermudah dalam mendapatkan data harga bahan bakar minyak terkini, khususnya untuk wilayah Jabodetabek.

## Endpoints
Pengguna dapat mengakses data seluruh informasi BBM dalam satu endpoint. Kurang efektif dalam digunakan, tetapi telah mencakup seluruh data yang diperlukan.
```
/api-bbm/full
```

Alternatif yang dapat diterapkan, dengan menggunakan endpoint yang lebih spesifik untuk satu jenis produk.
```
/api-bbm/{jenis}/{merek}/{oktan}
```

## Dokumentasi

| Parameter |                               Penjelasan                               |
| --------- | ---------------------------------------------------------------------- |
| jenis     | Merupakan jenis dari BBM: `bensin` dan `diesel`.                       |
| merek     | Merupakan merek produsen BBM: `Pertamina`, `Vivo`, `BP`, dan `Shell`.  |
| oktan     | Merupakan besaran oktan BBM yang berbeda bagi bensin dan diesel.       |
|           | Oktan untuk **bensin**: `90`, `92`, `95`, dan `98`.                    |
|           | Oktan untuk **diesel**: `48`, `51`, dan `53`.                          |

## Contoh Penggunaan

1. Mengambil `seluruh data BBM`.
   ```
   /api-bbm/full
   ```

   Maka, akan mendapatkan seluruh data BBM bensin dan diesel dari setiap merek dalam format JSON:
   ```
   {
    "bensin": {
        "Pertamina": {
            "90": "10.000\nPertalite",
            "92": "12.400 Pertamax",
            "95": "13.500  Pertamax Green",
            "98": "14.400 Pertamax Turbo"
        },
        "Vivo": {
            "90": "11.300 Revvo90",
            "92": "13.087 Revvo92",
            "95": "13.995  Revvo95",
            "98": "-"
        },
        "BP": {
            "90": "12.740 BP 90",
            "92": "12.990 BP 92",
            "95": "14.190 BP ultimate",
            "98": "-"
        },
        "Shell": {
            "90": "-",
            "92": "13.280 Super",
            "95": "14.190 V-Power",
            "98": "14.540 V-Power Nitro+"
        }
      },
      "diesel": {
          "Pertamina": {
              "48": "6.800 BioSolar",
              "51": "13.950 DexLite",
              "53": "14.350 Dex"
          },
          "BP": {
              "48": "13.970 BP Diesel",
              "51": "-",
              "53": "-"
          },
          "Shell": {
              "48": "-",
              "51": "14.410 V-Power Diesel",
              "53": "-"
          }
      },
      "update": "1 Agustus 2023",
      "source": "https://isibens.in/",
      "sourceCredits": {
          "developer": "Adham Somantrie",
          "website": "https://adha.ms/"
      },
      "scraperCredits": {
          "scraper": "Alif Maulidanar",
          "website": "https://alifmaulidanar.my.id/"
      }
   }
   ```
2. Mengambil data spesifik sebuah produk BBM. Misalnya, `Vivo Revvo95`
   ```
   /api-bbm/bensin/vivo/95
   ```

   Maka, akan mendapatkan data dari BBM `Vivo Revvo95`:
   ```
   {
    "brand": "Vivo",
    "produk": "Revvo95",
    "ron": "95",
    "harga": "13.995",
    "update": "1 Agustus 2023",
    "source": "https://isibens.in/",
    "sourceCredits": {
        "developer": "Adham Somantrie",
        "website": "https://adha.ms/"
    },
    "scraperCredits": {
        "scraper": "Alif Maulidanar",
        "website": "https://alifmaulidanar.my.id/"
      }
   }
   ```
3. Contoh lain, mengambil data BBM untuk diesel. Misalnya, `Shell V-Power Diesel`
   ```
   /api-bbm/diesel/shell/51
   ```

   Maka, akan mendapatkan data dari BBM `Shell V-Power Diesel`:
   ```
   {
    "brand": "Shell",
    "produk": "V-Power Diesel",
    "cn": "51",
    "harga": "14.410",
    "update": "1 Agustus 2023",
    "source": "https://isibens.in/",
    "sourceCredits": {
        "developer": "Adham Somantrie",
        "website": "https://adha.ms/"
    },
    "scraperCredits": {
        "scraper": "Alif Maulidanar",
        "website": "https://alifmaulidanar.my.id/"
      }
   }
   ```

## API Publik
Untuk mencoba API ini dapat mengunjungi tautan berikut:
```
https://alifmaulidanar.my.id/api-bbm/
```

## Kredit
Developer [isibens.in](https://isibens.in/) : [Adham Somantrie](https://adha.ms/)
