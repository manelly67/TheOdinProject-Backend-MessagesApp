const { Router } = require("express");
const controller  = require("../controllers/chat");
const router = Router();
const { verifyToken } = require("./middlewares");


router.get("/all", verifyToken , controller.getAllUserChats);

router.get("/new", verifyToken , controller.newGet);




module.exports = router;