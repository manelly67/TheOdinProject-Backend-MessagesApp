const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db_users = require("../prisma-queries/users");
const myObject = {};
require("dotenv").config({ processEnv: myObject });
const secret_key = process.env.SECRET_KEY || myObject.SECRET_KEY;

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
 
  // the following routes require password.js
const post = [
    passport.authenticate("local", {
      // AGREGAR LUEGO EL SUCCES REDIRECT
      failureRedirect: "/login",
      failureMessage: true,
    }),
    // successful login will grant the user a JWT
    async function (req, res) {
      const user = req.user;
      const session = req.session;
      const token = jwt.sign({ userId: user.id }, secret_key, {
        expiresIn: "1d",
      });
      await db_users.setStatusOn(user.id);
      const userdetails = await db_users.getUserFromId(user.id);
      return res.status(200).json({ user: userdetails, token: token, session:session });
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