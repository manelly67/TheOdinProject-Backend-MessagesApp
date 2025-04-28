const { Router } = require("express");
const controller  = require("../controllers/chat");
const router = Router();
const { verifyToken, isUser } = require("./middlewares");


router.get("/all", verifyToken , controller.getAllUserChats);

router.get("/new", verifyToken, isUser , controller.newGet);

router.post("/new", verifyToken, isUser , controller.post);


module.exports = router;