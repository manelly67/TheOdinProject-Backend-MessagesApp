
async function get(req, res) {
  return res.status(200).json({
    message: "Welcome to Messages APP",
  });
}

async function isAuth(req, res) {
  const authData = req.user;
  return res.status(200).json({
    isAuthenticated: true,
    authData: authData,
    message: "Welcome to protected routes",
  });
}

async function isGuest(req, res) {
  // luego agregar aqui la data que podra ver el guest
  
  return res.status(200).json({
    isGuest: true,
    message: "welcome to the guest routes",
    user: req.user,
  });
}

module.exports = { get, isAuth, isGuest };
