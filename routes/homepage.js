const { Router } = require("express");
const controller  = require("../controllers/homepage");
const router = Router();



router.get("/", controller.get);



module.exports = router;