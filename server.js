const express = require("express");
const apiFull = require("./full");
const apiOctane = require("./octane");

const app = express();
const PORT = 3000;

const swaggerUi = require("swagger-ui-express");
const apiDocumentation = require("./apiDocs.json");

app.use(
  "/api-bbm",
  apiFull,
  apiOctane,
  swaggerUi.serve,
  swaggerUi.setup(apiDocumentation)
);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
