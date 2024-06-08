const express = require("express");
const cors = require("cors");
const route =  require("./route/index.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

route(app);

module.exports = app;
