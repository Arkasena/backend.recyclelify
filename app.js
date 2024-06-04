"use strict";
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  res.send("♻️ Recyclelify");
});

app.listen(port, async () => {
  console.log(`🚀 Server running on port ${port}`);
});

module.exports = app;
