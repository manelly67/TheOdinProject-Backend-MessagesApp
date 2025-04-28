const { Router } = require("express");
const controller = require("../controllers/message");
const router = Router();
const { verifyToken, isUser } = require("./middlewares");

router.get("/new/:chat_id", verifyToken, isUser , controller.newGet);

router.post("/new/:chat_id", verifyToken, isUser , controller.post);

module.exports = router;