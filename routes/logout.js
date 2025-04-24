const { Router } = require("express");
const controller = require("../controllers/logout");
const router = Router();

router.get("/", controller.get);

module.exports = router;
