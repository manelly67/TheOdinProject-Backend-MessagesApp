async function get(req, res, next) {
  console.log(req.session.passport.user);
  req.user = req.session.passport.user;
  req.logout();
  
    return res.status(200).json({
      text: "successful logout",
      user: null,
      token: null,
    });
  

};

module.exports = {
  get,
};
