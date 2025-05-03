const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db_users = require("../prisma-queries/users");
const myObject = {};
require("dotenv").config({ processEnv: myObject });
const secret_key = process.env.SECRET_KEY || myObject.SECRET_KEY;
const guest_password = process.env.GUEST_PASSWORD || myObject.GUEST_PASSWORD;

async function get(req, res) {
  switch (req.isAuthenticated()) {
    case false:
      res.json({
        title: "LOGIN",
        errors: req.session.messages,
      });
      break;
    case true:
      res.status(302).json({
        title: "Logout Required",
        text: "You are already Login - Logout here is you want:",
      });
      break;
  }
}

const createGuest = async(req,res,next) => {
  const max = 10000;
  const min = 1;
  let exists = true;
  let guest = undefined;
  do {
    guest = `guest_${Math.floor(Math.random() * (max - min + 1) + min)}`;
    exists = await db_users.usernameExists(guest);
  } while (exists === true);

  bcrypt.hash(guest_password, 10, async (err, hashedPassword) => {
    if (err) {
      console.log(err);
    }
    // otherwise, store hashedPassword in DB
    try{
        const data = {
          id: uuidv4(),
          email: `${guest}@guest.com`,
          username: guest,
          role: 'GUEST',
        };
        const [created] = await db_users.createUser(data, hashedPassword);
        if(created){
          if(created.err){
            return res.status(400).json({
              message: created.msg,
              errors: [created],
            });
          }else{
            req.body = { username: guest, password: guest_password };
            next();
          }
        }
    }catch (err) {
      return next(err);
    }
  });
};


// the following routes require password.js
const post = [
  createGuest,
  passport.authenticate("local", {
    failureRedirect: "/login_as_guest",
    failureMessage: true,
  }),
  // successful login will grant the user a JWT
  async function (req, res) {
    const user = req.user;
    const session = req.session;
    const token = jwt.sign({ userId: user.id }, secret_key, {
      expiresIn: "1h",
    });
    await db_users.setStatusOn(user.id);
    const userdetails = await db_users.getUserFromId(user.id);
    return res
      .status(200)
      .json({ user: userdetails, token: token, session: session });
  },
];

// Las tres funciones requeridas para el funcionamiento de passport.js

passport.use(
  new LocalStrategy(async (username, password, done) => {
    //passport need this names (username and password) in the login form

    try {
      const user = await db_users.getUserFromUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
      //success
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db_users.getUserFromId(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = {
  get,
  post,
};
