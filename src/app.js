const express = require("express");
const api = require("./routes/api.route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", api);

app.get("/", async (req, res) => {
  res.send("♻️ Recyclelify");
});

module.exports = app;
