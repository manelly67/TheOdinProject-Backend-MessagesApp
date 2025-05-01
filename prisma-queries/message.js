const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { errWrapper } = require("./handle_prisma_errors");

async function createNew(data) {
    return  await prisma.message
      .create({
        data: {
          id: data.id,
          text: data.text,
          userFromId: data.userFromId,
          userToId: data.userToId,
          chatId: data.chatId,
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
  };

  module.exports = {
    createNew,
  };
