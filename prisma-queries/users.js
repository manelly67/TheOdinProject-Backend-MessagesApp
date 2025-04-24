const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const passwordRequirements =
  "Password must contain at least one number, one uppercase and lowercase letter, one special character, and at least 8 or more characters";

  async function createUser(req, res, hashedPassword) {
    await prisma.user
      .create({
        data: {
          email: `${req.body.email}`,
          username: `${req.body.username}`,
          password: `${hashedPassword}`,
          role: req.body.role,
        },
      })
      .then(async () => {
        const userCreated = await getUserFromUsername(req.body.username);
        await prisma.$disconnect();
        res.status(200).json({
          text: "user created login in your account",
          user: userCreated,
        });
      })
      .catch(async (err) => {
        if (err.code === "P2002") {
          const errFields = [
            { msg: `fields [ ${err.meta.target}] is already taken.` },
          ];
          return res.status(400).json({
            title: "Create | New User",
            message: 'input data errors',
            passwordRequirements: passwordRequirements,
            errors: errFields,
          });
        } else {
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
        profileId : true,
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
  };