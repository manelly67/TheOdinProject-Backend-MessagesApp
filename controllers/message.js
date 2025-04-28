const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const db_chats = require("../prisma-queries/chat");
const db_users = require("../prisma-queries/users");

const myObject = {};
require("dotenv").config({ processEnv: myObject });
const secret_key = process.env.SECRET_KEY || myObject.SECRET_KEY;

// Following routes require authentication

async function newGet(req, res) {
/*   const { chat_id } = req.params;
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
    const { userId } = authData;
    const chatDetails = await db_chats.getChatObjById(chat_id);
    if (chatDetails) {
      const { usersInChat } = chatDetails;
      const check = userIsChatMember(userId, usersInChat);
      switch (check) {
        case true:
          // mensaje usuario autorizado para escribir mensaje
          break;
        case false:
          // usuario no puede escribir mensajes en este chat
          break;
      }
    } else {
      // mensaje chat no existe
    }
  } */
}

const post = [];

function userIsChatMember(id, array) {
  return array.includes(id);
}

module.exports = {
  newGet,
  post,
};
