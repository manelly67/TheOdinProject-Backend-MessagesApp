const request = require('supertest');
const express = require('express');
const app = express();
const routes = require("../routes");

// test initial page
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
  

// test error page
app.use((req, res) => res.status(404).json({
    message: "oops page not found :)",
    title: "error page"
  }));
  
  request(app)
  .get('/nonexistent-url')
  .expect(404)
  .expect("Content-Type", /json/)
  .end((err, res) => {
    if (err) throw err;
  }); 