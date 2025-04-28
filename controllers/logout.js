async function get(req, res, next) {
  const {user_id} = req.body;
  req.user = user_id;

  req.logout((err) => {
    if (err) {
      next(err);
    }
    return res.status(200).json({
      text: "successful logout",
      user: null,
      token: null,
    });
  });
}

module.exports = {
  get,
};
