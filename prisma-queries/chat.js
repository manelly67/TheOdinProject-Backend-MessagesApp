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



module.exports = {
    getAllChats,
  };