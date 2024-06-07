const express = require("express");
const bodyParser = require("body-parser");
const { app: router1 } = require("./routes/index");
const { client, testRedis } = require("./utils/redis.js");
const { ValidationError } = require("express-json-validator-middleware");

require("dotenv").config();

const app = express();

const checkContentType = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).send({
      success: false,
      message: "Invalid content type. Only application/json is accepted.",
    });
  }
  next();
};

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).send({ error: err.errors });
    return;
  }
  next(err); // pass other errors to default error handler
});

// Apply the middleware
app.use(checkContentType);

testRedis();
app.use(bodyParser.json());
app.use("/api/v1/data", router1);

app.listen(process.env.PORT, () => {
  console.log(`Server started on Port ${process.env.PORT}`);
});
