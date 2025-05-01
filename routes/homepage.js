const { Router } = require("express");
const controller = require("../controllers/homepage");
const router = Router();
const { verifyToken, isAuth } = require("./middlewares");


router.get("/", controller.get);

router.get("/isauthenticated", verifyToken, isAuth, controller.isAuth);

router.get("/isguest", verifyToken, controller.isGuest);

module.exports = router;
