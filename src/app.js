const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const api = require("./routes/api.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ limits: { fileSize: 8 * 1024 * 1024 } }));

app.use("/api", api);

app.get("/", async (req, res) => {
  res.send("♻️ Recyclelify");
});

module.exports = app;
