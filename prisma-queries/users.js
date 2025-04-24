const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const passwordRequirements =
  "Password must contain at least one number, one uppercase and lowercase letter, one special character, and at least 8 or more characters";


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
  
  const getUserFromUsername = async (username) => {
    return await prisma.user.findUnique({
      where: { username: username },
      select:{
        id : true,          
        email : true,      
        username : true,     
        role : true,       
        status : true,     
        messagesFrom : true,
        messagesTo : true,
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
        messagesFrom : true,
        messagesTo : true,
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

  module.exports = {
    createUser,
    getUserFromUsername,
    getUserFromId,
  };