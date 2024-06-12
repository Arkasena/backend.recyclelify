const express = require("express");
const cors = require("cors");
const api = require("./routes/api.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", api);

app.get("/", async (req, res) => {
  res.send("♻️ Recyclelify");
});

module.exports = app;
