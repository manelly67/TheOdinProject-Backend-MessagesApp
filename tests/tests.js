const request = require("supertest");
const express = require("express");
const routes = require("../routes");
const app = express();

app.use("/", routes.homepage);

request(app)
  .get("/")
  .expect("Content-Type", /json/)
  .expect("Content-Length", "37")
  .expect(function (res) {
    res.body.message = res.body.message.toLowerCase();
  })
  .expect(200, { message: "welcome to messages app" })
  .end(function (err, res) {
    if (err) throw err;
  });