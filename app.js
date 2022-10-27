require("dotenv").config();
const express = require("express");
const app = express();

// Setup your Middleware and API Router here

const cors = require("cors");
app.use(cors());

app.use(express.json());

const apiRouter = require("./api");
app.use("/api", apiRouter);

const { client } = require("./db/index.js");

app.use("*", function (req, res, next) {
  res.status(404).send({ message: "Not Found" });
});
app.use(function (error, req, res, next) {
  res.send({ error: "error", message: error.message, name: "not Authorized" });
});
// app.use(function (err, req, res, next) {
//   console.log(err);
//   res.status(500).send({ error: err.message });
// });

module.exports = app;
