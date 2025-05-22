const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { errWrapper } = require("./handle_prisma_errors");

async function getAllChats(userId) {
  let chatsArray = [];
  const search = await prisma.user.findUnique({
    where:{
        id : userId,
    },
    select:{
        chats: true,
    },
  });
  const { chats } = search;
  for(let i=0; i < chats.length; i++){
    let chatId = chats[i];
    const temp = await prisma.chat.findUnique({
      where:{
        id : chatId,
     },
      select:{
        id: true,
        createdAt: true,
        usersInChat: true,
        messages:{
          select:{
            id: true,
            createdAt: true,
            text: true,
            userFrom: {
              select:{
                id: true,
                username: true,
                profile: true,
                status: true,
              },
            },
            userTo:{
              select:{
                id: true,
                username: true,
                profile: true,
                status: true,
              },
            },
          },
        },
      },
    });
   chatsArray.push(temp);
  }
   
  return chatsArray;

}

async function createNew(data) {
    return  await prisma.chat
      .create({
        data: {
          id: data.id,
          usersInChat: data.usersInChat,
        },
      })
      .then(async (res) => {
        await prisma.$disconnect();
        return [res];
      })
      .catch(async (err) => {
        if(err){
          return errWrapper(err);
        }else{
          await prisma.$disconnect();
          process.exit(1);
        }
      });
  }

async function chatExists(array) {
  const chat = await prisma.chat.findMany({
    where:{
      OR: [
        {
          usersInChat: {
            equals: [array[0],array[1]],
          },
        },
        {
          usersInChat: {
            equals: [array[1],array[0]],
          },
        },
      ],
    },
  });
  return chat.length > 0 ? true : false;
}

async function getChatObjById(id) {
  return await prisma.chat.findUnique({
    where:{
      id : id,
    },
    include:{
      messages : true,
    },
  });
}

async function getChatMembers(id) {
  return await prisma.chat.findUnique({
    where:{
      id : id,
    },
    select:{
      id : true,
      usersInChat : true,
    },
  });
}

module.exports = {
    getAllChats,
    createNew,
    chatExists,
    getChatObjById,
    getChatMembers,
  };