const { Router } = require("express");
const controller = require("../controllers/logout");
const router = Router();
const { setOff, verifyToken } = require("./middlewares");

router.get("/", verifyToken, setOff, controller.get);

module.exports = router;
