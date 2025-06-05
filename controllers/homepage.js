const db_chats = require("../prisma-queries/chat");
const db_profiles = require("../prisma-queries/profiles");
const db_users = require("../prisma-queries/users");
const { chat_model_id } = require("./chat_model_id");

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
  const chat_model = await db_chats.getChatObjById(chat_model_id);
  return res.status(200).json({
    isGuest: true,
    message: "welcome to the guest routes",
    user: req.user,
    chat_model: chat_model,
  });
}

async function chatModel(req, res) {
  const authData = req.user;
  const { userId } = authData;
  const chat_model = await db_chats.getChatObjById(chat_model_id);
  return res.status(200).json({
    isGuest: true,
    user: userId,
    chat_model: chat_model,
  });
}

async function availableUsers(req, res) {
  const list_of_users = await db_users.getListForGuest(chat_model_id);
  return res.status(200).json({
    isGuest: true,
    list_of_users: list_of_users,
  });
}


async function getProfile(req, res) {
  const { user_id } = req.params;
  const { usersInChat } = await db_chats.getChatMembers(chat_model_id);
  let allowed_profiles =  [...usersInChat]; 
  const authData = req.user;
  const { userId } = authData; // verified user
  allowed_profiles.push(userId);
  switch (allowed_profiles.length > 0) {
    case true:
      switch (allowed_profiles.includes(user_id)) {
        case true:{
          const user_profile = await db_profiles.getProfileById(user_id);
          const profile_options = await db_profiles.getProfileOptions();
          return res.status(200).json({
            user_profile: user_profile,
            profile_options: profile_options,
          });
        }
        case false:
          return res.status(400).json({
            message: "you are not authorized to view this profile",
          });
      }
      break;
    case false:
      return res.status(400).json({
        message: "error no members in chat",
      });
  }
}

module.exports = { get, isAuth, isGuest, chatModel, availableUsers, getProfile };
