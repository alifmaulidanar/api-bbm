const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

const brands = ["Pertamina", "Vivo", "BP", "Shell"];
const rons = ["90", "92", "95", "98"];
const dieselBrands = ["Pertamina", "BP", "Shell"];
const dieselRons = ["48", "51", "53"];
const source = "https://isibens.in/";
const sourceCredits = {
  developer: "Adham Somantrie",
  website: "https://adha.ms/",
};
const scraperCredits = {
  scraper: "Alif Maulidanar",
  website: "https://alifmaulidanar.my.id/",
};

router.get("/:jenis/:brand/:produk", async (req, res) => {
  try {
    const url = "https://isibens.in";
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const updateInfo = $("ul.text-small li strong").text();
    const updateDate = updateInfo.match(/\d+\s\w+\s\d+/);

    const updateText = updateDate
      ? `${updateDate[0]}`
      : "Tanggal tidak ditemukan";

    const tables = $("table");

    const jenis = req.params.jenis.toLowerCase();
    const brand = req.params.brand;
    const produk = req.params.produk;

    if (jenis == "bensin") {
      const gasolineTableColumns = getTableColumns($, tables[0]);
      const brandIndex = getBrandIndex(brand);
      const ronIndex = getRONIndex(produk);

      if (brandIndex !== -1) {
        if (ronIndex !== -1) {
          if (
            (brand == "vivo" && produk == "98") ||
            (brand == "bp" && (produk == "90" || produk == "98")) ||
            (brand == "shell" && produk == "90")
          ) {
            res.status(400).json({
              status: "fail",
              message:
                brands[brandIndex] +
                " tidak menyediakan BBM bensin dengan RON " +
                rons[ronIndex] +
                ".",
              data: null,
            });
          } else {
            const data = gasolineTableColumns[brandIndex][ronIndex];
            const { produk, harga } = parseData(data);
            res.status(200).json({
              status: "success",
              message: "Berhasil menampilkan data BBM.",
              data: {
                brand: brands[brandIndex],
                produk,
                ron: rons[ronIndex],
                harga,
                update: updateText,
                source: source,
                sourceCredits: sourceCredits,
                scraperCredits: scraperCredits,
              },
            });
          }
        } else {
          res.status(400).json({
            status: "fail",
            message: "Oktan BBM tidak valid.",
            data: null,
          });
        }
      } else {
        res.status(400).json({
          status: "fail",
          message: "Merek BBM tidak valid.",
          data: null,
        });
      }
    } else if (jenis === "diesel") {
      const dieselTableColumns = getTableColumns($, tables[1]);
      const brandIndex = getDieselBrandIndex(brand);
      const ronIndex = getDieselRONIndex(produk);

      if (brandIndex !== -1) {
        if (ronIndex !== -1) {
          if (
            (brand == "bp" && (produk == "51" || produk == "53")) ||
            (brand == "shell" && (produk == "48" || produk == "53"))
          ) {
            res.status(400).json({
              status: "fail",
              message:
                dieselBrands[brandIndex] +
                " tidak menyediakan BBM diesel dengan CN " +
                dieselRons[ronIndex] +
                ".",
              data: null,
            });
          } else {
            const data = dieselTableColumns[brandIndex][ronIndex];
            const { produk, harga } = parseData(data);
            res.status(200).json({
              status: "success",
              message: "Berhasil mendapatkan data BBM.",
              data: {
                brand: dieselBrands[brandIndex],
                produk,
                cn: dieselRons[ronIndex],
                harga,
                update: updateText,
                source: source,
                sourceCredits: sourceCredits,
                scraperCredits: scraperCredits,
              },
            });
          }
        } else {
          res.status(400).json({
            status: "fail",
            message: "Oktan BBM tidak valid.",
            data: null,
          });
        }
      } else {
        res.status(400).json({
          status: "fail",
          message: "Merek BBM tidak valid.",
          data: null,
        });
      }
    } else {
      res.status(400).json({
        status: "fail",
        message: "Jenis BBM tidak valid.",
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      error: error,
      message: "Terjadi kesalahan pada server.",
      data: null,
    });
  }
});

function getTableColumns($, table) {
  const tableColumns = [];
  $(table)
    .find("tr")
    .each((index, row) => {
      const columns = $(row).find("td");
      columns.each((colIndex, colElement) => {
        if (!tableColumns[colIndex]) {
          tableColumns[colIndex] = [];
        }
        tableColumns[colIndex].push($(colElement).text().trim());
      });
    });
  return tableColumns;
}

function getBrandIndex(brand) {
  return brands.findIndex((b) => b.toLowerCase() === brand.toLowerCase());
}

function getRONIndex(ron) {
  return rons.indexOf(ron);
}

function parseData(data) {
  const [harga, ...produkArr] = data.split(/[\n\s]+/);
  const produk = produkArr.join(" ");
  return { produk, harga };
}

function getDieselBrandIndex(brand) {
  return dieselBrands.findIndex((b) => b.toLowerCase() === brand.toLowerCase());
}

function getDieselRONIndex(ron) {
  return dieselRons.indexOf(ron);
}

module.exports = router;
