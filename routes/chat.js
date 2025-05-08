const { Router } = require("express");
const controller  = require("../controllers/chat");
const router = Router();
const { verifyToken, isAuth ,isUser } = require("./middlewares");


router.get("/all", verifyToken , controller.getAllUserChats); 

router.get("/new", verifyToken, isAuth, isUser , controller.newGet);

router.post("/new", verifyToken, isAuth, isUser , controller.post);


module.exports = router;