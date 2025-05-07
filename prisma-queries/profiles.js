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

async function getProfileById(id) { 
  return await prisma.profile.findUnique({
    where:{
      userId: id,
    },
    select:{
      id: true,
      nametoshow: true,
      avatar :{
        select:{
            id: true,
            src_image : true,
        },
      },
      bgcolor:{
        select:{
            id: true,
            colorcode : true,
        },
      },
    textcolor:{
        select:{
            id: true,
            colorcode : true,
        },
    },
    aboutme: true,  
    },
  });
};

async function getProfileOptions() { 
  const colors = await prisma.color.findMany();
  const avatars = await prisma.avatar.findMany();
  return { available_colors:colors, available_avatars:avatars };
};

module.exports = {
    createProfile,
    updateProfile,
    getProfileById,
    getProfileOptions,
  };