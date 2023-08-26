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

    if (jenis === "bensin") {
      const gasolineTableColumns = getTableColumns($, tables[0]);
      const brandIndex = getBrandIndex(brand);
      const ronIndex = getRONIndex(produk);

      if (brandIndex !== -1 && ronIndex !== -1) {
        const data = gasolineTableColumns[brandIndex][ronIndex];
        const { produk, harga } = parseData(data);
        res.json({
          brand: brands[brandIndex],
          produk,
          ron: rons[ronIndex],
          harga,
          update: updateText,
          source: source,
          sourceCredits: sourceCredits,
          scraperCredits: scraperCredits,
        });
      } else {
        res.status(404).json({ error: "Data tidak ditemukan" });
      }
    } else if (jenis === "diesel") {
      const dieselTableColumns = getTableColumns($, tables[1]);
      const brandIndex = getDieselBrandIndex(brand);
      const ronIndex = getDieselRONIndex(produk);

      if (brandIndex !== -1 && ronIndex !== -1) {
        const data = dieselTableColumns[brandIndex][ronIndex];
        const { produk, harga } = parseData(data);
        res.json({
          brand: dieselBrands[brandIndex],
          produk,
          cn: dieselRons[ronIndex],
          harga,
          update: updateText,
          source: source,
          sourceCredits: sourceCredits,
          scraperCredits: scraperCredits,
        });
      } else {
        res.status(404).json({ error: "Data tidak ditemukan" });
      }
    } else {
      res.status(400).json({ error: "Jenis BBM tidak valid" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan");
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
