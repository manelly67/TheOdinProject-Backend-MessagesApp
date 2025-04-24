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

module.exports.isUser = (req,res,next) => {
  const role = req.user.role;
  if (role === "USER") {
      next();
  }else{
      // no permitir algunas acciones
  }
};