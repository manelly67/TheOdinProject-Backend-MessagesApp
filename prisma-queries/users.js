const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();


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
        if (err.code === "P2002") {
          const errFields = [
            { msg: `fields [ ${err.meta.target}] is already taken.` },
          ];
          return errFields;
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

  module.exports = {
    createUser,
    getUserFromUsername,
    getUserFromId,
    setStatusOff,
    setStatusOn,
  };