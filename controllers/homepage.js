// GET /
async function get(req, res) {
  return res.status(200).json({
    message: "Welcome to Messages APP",
  });
}

module.exports = { get };
