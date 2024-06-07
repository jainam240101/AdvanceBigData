const express = require("express");
const { Validator } = require("express-json-validator-middleware");
const { userSchema } = require("../schemas/UserSchema");
const {
  addDataToRedis,
  getDataFromRedis,
  deleteDataFromRedis,
} = require("../utils/redis");

const app = express.Router();

const validator = new Validator({ allErrors: true });
const validate = validator.validate;

app.post("/", validate({ body: userSchema }), async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      age: req.body.age,
    };
    await addDataToRedis(req.body.username, data);
    return res.status(201).send({
      success: true,
      message: "Data received",
      data,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/:username", async (req, res) => {
  try {
    const data = await getDataFromRedis(req.params.username);
    return res.status(200).send({
      success: true,
      message: "Data fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.delete("/:username", async (req, res) => {
  try {
    await deleteDataFromRedis(req.params.username);
    console.log(`User : ${req.params.username} deleted`);
    return res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = { app };
