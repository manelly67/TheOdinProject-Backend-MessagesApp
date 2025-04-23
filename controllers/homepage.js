// GET /
async function get(req, res) {
    console.log('probando');
  return res.status(200).json({
    message: "Welcome to Messages APP",
  });
}

module.exports = { get };
