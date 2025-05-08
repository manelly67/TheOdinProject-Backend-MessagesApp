const { Router } = require("express");
const controller = require("../controllers/homepage");
const router = Router();
const { verifyToken, isAuth, isGuest } = require("./middlewares");

router.get("/", controller.get);

router.get("/isauthenticated", verifyToken, isAuth, controller.isAuth);

// limited content for the guest
router.get("/isguest", verifyToken, isAuth, isGuest, controller.isGuest);

router.get(
  "/isguest/chat_model",
  verifyToken,
  isAuth,
  isGuest,
  controller.chatModel
);

router.get(
  "/isguest/profile/:user_id",
  verifyToken,
  isAuth,
  isGuest,
  controller.getProfile
);

module.exports = router;
