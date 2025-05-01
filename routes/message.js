const { Router } = require("express");
const controller = require("../controllers/message");
const router = Router();
const { verifyToken, isAuth ,isUser } = require("./middlewares");

router.get("/new/:chat_id/:user_to", verifyToken, isAuth, isUser , controller.newGet);

router.post("/new/:chat_id/:user_to", verifyToken, isAuth, isUser , controller.post);



module.exports = router;