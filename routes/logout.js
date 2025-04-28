const { Router } = require("express");
const controller = require("../controllers/logout");
const router = Router();
const { setOff } = require("./middlewares");

router.get("/", controller.get);

module.exports = router;
