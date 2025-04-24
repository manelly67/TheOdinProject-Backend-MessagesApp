const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");
const passwordValidation = require("./signup_validation_password");
const db_users = require("../prisma-queries/users");
const passwordRequirements =
  "Password must contain at least one number, one uppercase and lowercase letter, one special character, and at least 8 or more characters";


async function get(req,res) {
    switch (req.isAuthenticated()) {
        case false:
          res.status(200).json({
            title: "Create | New User",
            message: 'sign up here',
            passwordRequirements: passwordRequirements,
          });
          break;
        case true:
          res.status(302).json({
            title: "Logout Required",
            message: "You are already Login - Logout if you want to create a new user",
          });
          break;
      }
};

// sign-up POST form validation
const emailErr = "must be a valid email address";
const usernameErr = "Excessive use of characters";
const passwordErr = passwordRequirements;
const confirmErr = "Confirmation password must be equal to password";

const validateUser = [
  body("email").trim().isEmail().withMessage(`Email ${emailErr}`),
  body("username")
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage(`Username has ${usernameErr}`),
  body("user_password")
    .custom((value) => {
      return passwordValidation(value);
    })
    .withMessage(passwordErr),
  body("confirm_password")
    .custom((value, { req }) => {
      return value === req.body.user_password;
    })
    .withMessage(confirmErr),
];

const post = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        title: "Create | New User",
        message: 'input data errors',
        passwordRequirements: passwordRequirements,
        errors: errors.array(),
      });
    }
    bcrypt.hash(req.body.user_password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log(err);
      }
      // otherwise, store hashedPassword in DB
      try {
        const data = {
          id: uuidv4(),
          email: req.body.email,
          username: req.body.username,
          role: req.body.role,
        };
        const [created] = await db_users.createUser(data, hashedPassword);
        if(created){
          if(created.msg){
            return res.status(400).json({
              title: "Create | New User",
              message: 'field value is already taken',
              passwordRequirements: passwordRequirements,
              errors: [created],
            });
          }else{
            const userdetails = await db_users.getUserFromId(created.id);
            return res.status(200).json({
              text: "user created login in your account",
              user: userdetails,
            });
          }
        }
      } catch (err) {
        return next(err);
      }
    });
  },
];




module.exports = {
    get,
    post,
  };