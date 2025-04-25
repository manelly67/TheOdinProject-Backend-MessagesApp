const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const db_chats = require("../prisma-queries/chat");

const myObject = {};
require("dotenv").config({ processEnv: myObject });
const secret_key = process.env.SECRET_KEY || myObject.SECRET_KEY;

// Following routes require authentication

async function getAllUserChats(req, res) {
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
    const allChatsDetails = await db_chats.getAllChats(authData.userId);
    return res.status(200).json({
      user: authData.userId,
      chats: allChatsDetails,
    });
  }
}

async function newGet(req, res) {
  jwt.verify(req.token, secret_key, (err, authData) => {
    if (err) {
      res.status(403).json({
        err: err,
      });
    } else {
      return res.status(200).json({
        title: "CREATE NEW CHAT",
        authData,
      });
    }
  });
}

module.exports = {
  getAllUserChats,
  newGet,
};
