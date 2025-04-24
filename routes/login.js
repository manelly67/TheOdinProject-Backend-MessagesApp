const { Router } = require("express");
const router = Router();
const controller = require("../controllers/login");
const { clearMessages } = require("./middlewares");

router.get("/", controller.get);

// the following route require password.js
router.post("/", clearMessages ,controller.post);

module.exports = router;