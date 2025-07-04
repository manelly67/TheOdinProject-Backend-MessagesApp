const { Router } = require("express");
const controller = require("../controllers/profile");
const router = Router();
const { verifyToken, isAuth, isUser } = require("./middlewares");

router.get("/:user_id", verifyToken, isAuth, isUser, controller.get);

router.post("/:user_id", verifyToken, isAuth, controller.post);

router.put("/:user_id", verifyToken, isAuth, controller.put);


module.exports = router;
