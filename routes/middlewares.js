const jwt = require("jsonwebtoken");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const db_users = require("../prisma-queries/users");

const myObject = {};
require("dotenv").config({ processEnv: myObject });
const secret_key = process.env.SECRET_KEY || myObject.SECRET_KEY;

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

module.exports.isAuth = async (req, res, next) => {
   const authData = jwt.verify(req.token, secret_key, (err, authData) => {
    if (err) {
      return res.status(403).json({
        err: err,
      });
    } else {
      return authData;
    }
  });
  if (authData.statusCode !== 403) {
    const { userId, exp }  = authData;
    const up = new Date((exp + 60) * 1000);
    const low = new Date((exp - 60) * 1000);
    const sessions = await prisma.session.findMany({
      where: {
        AND: {
          data: {
            path: ["passport"]["user"],
            string_contains: `${userId}`,
          },
          expiresAt: {
            gte: low,
            lt: up,
          },
        },
      },
    });
    switch (sessions.length > 0) {
      case true:
        req.user = authData;
        next();
        break;
      case false:
        res.status(400).json({
          message: "the user's session was closed",
        });
        break;
    }
  }
};

module.exports.isUser = async (req, res, next) => {
    const authData = req.user;
    const { role } = await db_users.getRole(authData.userId);
    if (role === "USER") {
  /*     req.user = authData; */
      next();
    } else {
      return res.status(400).json({
        message: "you are in GUEST mode - this action is forbidden",
      });
    }
};

module.exports.isGuest = async (req, res, next) => {
  const authData = req.user;
  const { role } = await db_users.getRole(authData.userId);
  if (role === "GUEST") {
/*     req.user = authData; */
    next();
  } else {
    return res.status(400).json({
      isGuest: false,
      message: "You are not a Guest",
    });
  }
};


module.exports.setOff = async (req, res, next) => {
  const authData = jwt.verify(req.token, secret_key, (err, authData) => {
    if (err) {
      return res.status(403).json({
        err: err,
      });
    } else {
      return authData;
    }
  });
  if (authData.statusCode !== 403) {
    req.user = authData;
    await db_users.setStatusOff(authData.userId);
    next();
  }
};
