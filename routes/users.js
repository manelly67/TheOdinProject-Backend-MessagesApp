const { Router } = require("express");
const controller = require("../controllers/users");
const router = Router();
const { verifyToken, isAuth ,isUser } = require("./middlewares");

router.get("/list", verifyToken, isAuth, isUser , controller.getList);



module.exports = router;