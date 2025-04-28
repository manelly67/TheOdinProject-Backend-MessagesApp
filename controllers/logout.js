async function get(req, res, next) {
  req.user = req.session.user;
  req.logout();
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }
   /*  res.clearCookie('connect.sid', { path: '/' }); */
    return res.status(200).clearCookie('connect.sid', { path: '/' }).json({
      text: "successful logout",
      user: null,
      token: null,
    });
  });

};

module.exports = {
  get,
};
