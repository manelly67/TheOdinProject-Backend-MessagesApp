// GET /
async function get(req, res) {
  return res.status(200).json({
    message: "Welcome to Messages APP",
  });
}

async function isAuth(req, res) {
  switch (req.isAuthenticated()) {
    case false:
      res.json({
        isAuthenticated: false,
      });
      break;
    case true:
      res.json({
        isAuthenticated: true,
      });
      break;
  }
}

module.exports = { get, isAuth };
