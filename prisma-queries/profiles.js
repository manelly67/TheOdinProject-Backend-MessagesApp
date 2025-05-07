const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { errWrapper } = require("./handle_prisma_errors");

async function createProfile(data) {
    return await prisma.profile.create({
        data: {
            id: data.id,
            nametoshow: data.nametoshow,
            avatarId: data.avatarId,
            bgcolorId: data.bgcolorId,
            textcolorId: data.textcolorId,
            aboutme: data.aboutme,
            userId: data.userId,
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

async function updateProfile(data) {
    return await prisma.profile.update({
        where:{
          id: data.id,
        },
        data: {
            nametoshow: data.nametoshow,
            avatarId: data.avatarId,
            bgcolorId: data.bgcolorId,
            textcolorId: data.textcolorId,
            aboutme: data.aboutme,
        },
      });
};

module.exports = {
    createProfile,
    updateProfile,
  };