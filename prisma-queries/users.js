const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { errWrapper } = require("./handle_prisma_errors");


async function createUser(data, hashedPassword) {
  return  await prisma.user
      .create({
        data: {
          id: data.id,
          email: data.email,
          username: data.username,
          password: hashedPassword,
          role: data.role,
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
  
  // this function is used by login passport to validate password
  const getUserFromUsername = async (username) => {
    return await prisma.user.findUnique({
      where: { username: username },
      select:{
        id : true,          
        email : true,      
        username : true,
        password : true,    
        role : true,       
        status : true,     
        profile : {
            select:{
                nametoshow : true,
                avatar :{
                    select:{
                        src_image : true,
                    },
                },    
                bgcolor:{
                    select:{
                        colorcode : true,
                    },
                },
                textcolor:{
                    select:{
                        colorcode : true,
                    },
                },
                aboutme: true,
            },
        },
      },
    });
  };

  const getUserFromId = async (id) => {
    return await prisma.user.findUnique({
      where: { id: id },
      select:{
        id : true,          
        email : true,      
        username : true,     
        role : true,       
        status : true,
        chats : true,     
        profile : {
            select:{
                nametoshow : true,
                avatar :{
                    select:{
                        src_image : true,
                    },
                },    
                bgcolor:{
                    select:{
                        colorcode : true,
                    },
                },
                textcolor:{
                    select:{
                        colorcode : true,
                    },
                },
                aboutme: true,
            },
        },
      },
    });
  };

  const setStatusOff = async (id) => {
    return await prisma.user.update({
      where:{
        id: id,
      },
      data: {
        status: "OFF",
      },
    });
  };

  const setStatusOn = async (id) => {
    return await prisma.user.update({
      where:{
        id: id,
      },
      data: {
        status: "ONLINE",
      },
    });
  };

  const userExists = async (id) => {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    return !user ? false : true;
  };

  const usernameExists = async (username) => {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    return !user ? false : true;
  };

const assignChatToUser = async (chatId, userId) => {
  let user = await prisma.user.findUnique({where:{id:userId}});
  switch(!user.chats){
    case true:{
      let chatArray = [];
      chatArray.push(chatId);
      await prisma.user.update({
        where:{id:userId},
        data:{chats: chatArray},
      });
    }
      break;
    case false:{
      let chatArray = user.chats;
      chatArray.push(chatId);
      await prisma.user.update({
        where:{id:userId},
        data:{chats: chatArray},
      });
    }
    break;
  }
};

const getRole = async (id) => {
  return await prisma.user.findUnique({
    where:{
      id: id,
    },
    select:{
      role: true,
    },
  });
};

const getList = async () => {
  return await prisma.user.findMany({
    where:{
      role: "USER",
    },
    select:{
      id: true,
      username: true,
      status: true,
      profile: true,
      chats: true,
    },
  });
};

  module.exports = {
    createUser,
    getUserFromUsername,
    getUserFromId,
    setStatusOff,
    setStatusOn,
    userExists,
    usernameExists,
    assignChatToUser,
    getRole,
    getList,
  };