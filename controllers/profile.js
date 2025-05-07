const db_profiles = require("../prisma-queries/profiles");

async function get(req, res) {
  const { user_id } = req.params;
  const user_profile = await db_profiles.getProfileById(user_id);
      const profile_options = await db_profiles.getProfileOptions();
      return res.status(200).json({
        user_profile: user_profile,
        profile_options: profile_options,
      });
}

module.exports = { get };
