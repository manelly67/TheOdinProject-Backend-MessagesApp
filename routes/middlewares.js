const db_users = require("../prisma-queries/users");

module.exports.clearMessages = (req, res, next) => {
  req.session.messages = null;
  next();
};

// FORMAT OF TOKEN
// Authorization: bearer <access_token>
module.exports.verifyToken = (req, res, next) => {
  // get auth header value
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    // split at the space
    const bearer = bearerHeader.split(" ");
    // get token from array
    const [, bearerToken] = bearer;
    // set the token
    req.token = bearerToken;
    // next middleware
    next();
  } else {
    // forbidden
    res.sendStatus(403);
  }
};

module.exports.isUser = (req, res, next) => {
  const role = req.user.role;
  if (role === "USER") {
    next();
  } else {
    res.status(400).json({
      message: "you are in GUEST mode - this action is forbidden",
    });
  }
};

module.exports.setOff = async (req, res, next) => {
  const { user_id } = req.body;
  if (user_id) {
    await db_users.setStatusOff(user_id);
  }
  next();
};
