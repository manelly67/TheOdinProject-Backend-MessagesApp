const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function get(req, res, next) {
 
  const { userId, exp } = req.user;
  const up = new Date((exp + 60) * 1000);
  const low = new Date((exp - 60) * 1000);

  const sessions = await prisma.session.findMany({
    where: {
      AND: {
        data: {
          path: ["passport"]["user"],
          string_contains: `${userId}`,
        },
        expiresAt: {
          gte: low,
          lt: up,
        },
      },
    },
  });

  switch (sessions.length === 1) {
    case true:
      {
        const [session] = sessions;
        req.sessionID = session.id;
        req.logout((err) => {
          if (err) {
            next(err);
          } else {
            return res.status(200).json({
              text: "successful logout",
              user: null,
              token: null,
            });
          }
        });
      }
      break;
    case false:
      await prisma.session.deleteMany({
        where: {
          data: {
            path: ["passport"]["user"],
            string_contains: `${userId}`,
          },
        },
      });
      return res.status(200).json({
        text: "you were logout of all your sessions",
        user: null,
        token: null,
      });
  }
}

module.exports = {
  get,
};
