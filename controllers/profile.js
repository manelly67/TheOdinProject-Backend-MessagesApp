const { body, validationResult } = require("express-validator");
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

// validate text message

const textmessageErr = "text exceeds the number of characters allowed:";
const validateText = [
  body("nametoshow")
    .trim()
    .escape()
    .isLength({ max: 30 })
    .withMessage(`${textmessageErr} 30`),
  body("aboutme")
    .trim()
    .escape()
    .isLength({ max: 250 })
    .withMessage(`${textmessageErr} 250`),
];

const post = [
  validateText,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "input data errors",
        errors: errors.array(),
      });
    }
    const { user_id } = req.params;
    const { userId } = req.user;
    switch (user_id === userId) {
      case true:
        {
          const { nametoshow, aboutme, avatarId, bgcolorId, textcolorId } =
            req.body;
          const data = {
            id: `${userId}_profile`,
            nametoshow: nametoshow,
            avatarId: avatarId,
            bgcolorId: bgcolorId,
            textcolorId: textcolorId,
            aboutme: aboutme,
            userId: userId,
          };
          const [created] = await db_profiles.createProfile(data);
          if (created) {
            if (created.err) {
              return res.status(400).json({
                message: "an error occurred",
                errors: [created],
              });
            } else {
              const user_profile = await db_profiles.getProfileById(user_id);
              return res.status(200).json({
                user_profile: user_profile,
              });
            }
          }
        }
        break;
      case false:
        return res.status(400).json({
          message: "the user can modify only his own profile",
        });
    }
  },
];

module.exports = { get, post };
