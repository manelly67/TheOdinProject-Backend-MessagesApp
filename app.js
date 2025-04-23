const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

const express = require("express");
const session = require("express-session");
const routes = require("./routes");
const cors = require("cors");

const app = express();

// routes
app.use("/", routes.homepage);

app.listen(port, host, () => {
  console.log(`Server is running on ${host}:${port}`);
});
