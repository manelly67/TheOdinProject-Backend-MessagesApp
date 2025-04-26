const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { errWrapper } = require("./handle_prisma_errors");

async function getAllChats(userId) {
    return await prisma.user.findMany({
        where:{
            id : userId,
        },
        select:{
            chats: {
                select:{
                    id: true,
                    createdAt: true,
                    users: {
                        select:{
                            id : true,
                            username : true,
                            status : true,
                        },
                    },
                    messages: {
                        select:{
                            id : true,
                            createdAt : true,
                            text : true,
                            userFrom : {select:{
                                id : true,
                                username : true,
                            },},
                            userTo : {select:{
                                id : true,
                                username : true,
                            },},
                        },
                    },
                },
            },
        },
    });
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

module.exports = {
    getAllChats,
    createNew,
    chatExists,
    getChatObjById,
  };