const { v4: uuidv4 } = require("uuid");
const db_chats = require("../prisma-queries/chat");
const db_users = require("../prisma-queries/users");

// Following routes require authentication
async function getAllUserChats(req, res) {
  const authData = req.user;
  const allChatsDetails = await db_chats.getAllChats(authData.userId);
  return res.status(200).json({
    user: authData.userId,
    chats: allChatsDetails,
  });
}

async function newGet(req, res) {
  const authData = req.user;
  return res.status(200).json({
    title: "CREATE NEW CHAT",
    authData,
  });
}

async function post(req, res) {
  const { usertoId } = req.body;
  const authData = req.user;
  const { userId } = authData;
  const array = [userId, usertoId];
  let exists = [];
  for (const id of array) {
    let temp = await db_users.userExists(id);
    exists.push(temp);
  }
  switch (exists.includes(false)) {
    case true:
      return res.status(400).json({
        message: "at least one user does not exist",
      });
    case false:
      {
        const chatExists = await db_chats.chatExists(array);
        switch (chatExists) {
          case true:
            return res.status(400).json({
              message: "there is already a chat for these users",
            });
          case false: {
            const data = {
              id: uuidv4(),
              usersInChat: array,
            };
            const [created] = await db_chats.createNew(data);
            if (created) {
              if (created.err) {
                return res.status(400).json({
                  message: "an error occurred",
                  errors: [created],
                });
              } else {
                for (const id of array) {
                  await db_users.assignChatToUser(created.id, id);
                }
                const chatObject = await db_chats.getChatObjById(created.id);
                return res.status(200).json({
                  text: "new chat created",
                  chat: chatObject,
                });
              }
            }
          }
        }
      }
      break;
  }
}

module.exports = {
  getAllUserChats,
  newGet,
  post,
};
