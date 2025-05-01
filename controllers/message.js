const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const db_chats = require("../prisma-queries/chat");
const db_messages = require("../prisma-queries/message");

// Following routes require authentication

async function newGet(req, res) {
  const { chat_id, user_to } = req.params;
  const authData = req.user;
  const { userId } = authData;
  const chatDetails = await db_chats.getChatObjById(chat_id);
  if (chatDetails) {
    const { usersInChat } = chatDetails;
    const check = userIsChatMember(userId, usersInChat);
    switch (check) {
      case true:
        return res.status(200).json({
          message: "user can write messages in this chat",
          user_from: userId,
          user_to: user_to,
        });
      case false:
        return res.status(400).json({
          message: "user is not a member of this chat",
        });
    }
  } else {
    return res.status(400).json({
      message: "chat does not exist",
    });
  }
}

// validate text message

const textmessageErr = "text exceeds the number of characters allowed:";
const validateUser = [
  body("text")
    .trim()
    .escape()
    .isLength({ max: 250 })
    .withMessage(`${textmessageErr} 250`),
];

const post = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "input data errors",
        errors: errors.array(),
      });
    }

    const { chat_id, user_to } = req.params;
    const { text } = req.body;
    const authData = req.user;
    const { userId } = authData;
    const chatDetails = await db_chats.getChatObjById(chat_id);
    if (chatDetails) {
      const { usersInChat } = chatDetails;
      const check = userIsChatMember(userId, usersInChat);
      switch (check) {
        case true:{
          // create message
          const data = {
            id: uuidv4(),
            text: text,
            userFromId: userId,
            userToId: user_to,
            chatId: chat_id,
          };
          const [created] = await db_messages.createNew(data);
          if (created) {
            if (created.err) {
              return res.status(400).json({
                message: "an error occurred",
                errors: [created],
              });
            } else {
              const chat_updated = await db_chats.getChatObjById(chat_id);
              return res.status(200).json({
                message: "new message created",
                message_details: created,
                chat_updated: chat_updated,
              });
            }
          }
        }
        break;
        case false:
          return res.status(400).json({
            message: "user is not a member of this chat",
          });
      }
    } else {
      return res.status(400).json({
        message: "chat does not exist",
      });
    }
  },
];

function userIsChatMember(id, array) {
  return array.includes(id);
}

module.exports = {
  newGet,
  post,
};
