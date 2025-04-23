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

module.exports = {
    get,
  };