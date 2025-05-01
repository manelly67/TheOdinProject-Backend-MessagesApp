const db_users = require("../prisma-queries/users");

async function getList(req, res) {
  const list_of_users = await db_users.getList();
  return res.status(200).json({
    list_of_users: list_of_users,
  });
}

module.exports = { getList };
