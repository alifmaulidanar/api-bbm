const express = require("express");
const apiFull = require("./full");
const apiOctane = require("./octane");

const app = express();
const PORT = 3000;

app.use("/api-bbm", apiFull, apiOctane);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
