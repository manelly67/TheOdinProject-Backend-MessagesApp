const { Router } = require("express");
const controller  = require("../controllers/homepage");
const router = Router();


router.get("/", controller.get);

router.get("/isauthenticated", controller.isAuth);



module.exports = router;