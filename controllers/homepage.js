const jwt = require("jsonwebtoken");
const db_users = require("../prisma-queries/users");

const myObject = {};
require("dotenv").config({ processEnv: myObject });
const secret_key = process.env.SECRET_KEY || myObject.SECRET_KEY;

async function get(req, res) {
  return res.status(200).json({
    message: "Welcome to Messages APP",
  });
}

async function isAuth(req, res) {
  const authData = req.user;
  return res.status(200).json({
    isAuthenticated: true,
    authData: authData,
    message: "Welcome to protected routes",
  });
}

async function isGuest(req, res) {
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
    const { role } = db_users.getRole(authData.userId);
    switch (role === "GUEST") {
      case true:
        // luego agregar aqui la data que podra ver el guest
        return res.status(200).json({
          isGuest: true,
          message: "Welcome to Message Guest visiting routes",
        });
      default:
        return res.status(200).json({
          isGuest: false,
          message: "You are not a Guest",
        });
    }
  }
}

module.exports = { get, isAuth, isGuest };
