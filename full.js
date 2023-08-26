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

router.get("/full", async (req, res) => {
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

    const gasolineTableColumns = getTableColumns($, tables[0]);
    const dieselTableColumns = getTableColumns($, tables[1]);

    const gasolineData = processData(gasolineTableColumns);
    const dieselData = processData(dieselTableColumns);

    const formattedData = {
      bensin: formatData(brands, rons, gasolineData),
      diesel: formatData(dieselBrands, dieselRons, dieselData),
      update: updateText,
      source: source,
      sourceCredits: sourceCredits,
      scraperCredits: scraperCredits,
    };

    res.json(formattedData);
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

function processData(tableColumns) {
  const data = [];
  tableColumns.forEach((columnData) => {
    if (columnData.length > 0) {
      data.push(columnData);
    }
  });
  return data;
}

function formatData(brands, rons, data) {
  const formatted = {};
  brands.forEach((brand, brandIndex) => {
    formatted[brand] = {};
    data[brandIndex].forEach((product, ronIndex) => {
      formatted[brand][rons[ronIndex]] = product;
    });
  });
  return formatted;
}

module.exports = router;
