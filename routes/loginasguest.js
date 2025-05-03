const { Router } = require("express");
const router = Router();
const controller = require("../controllers/loginasguest");


router.get("/", controller.get);

// the following route require password.js
router.post("/", controller.post);

module.exports = router;