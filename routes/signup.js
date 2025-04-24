const { Router } = require("express");
const controller = require("../controllers/signup");
const router = Router();

router.get("/", controller.get);

router.post("/", controller.post);

module.exports = router;
