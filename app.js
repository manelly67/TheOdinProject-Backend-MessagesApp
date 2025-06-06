const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require('./generated/prisma');
const passport = require("passport");

const routes = require("./routes");

const app = express();
// Enable CORS
/* app.use(cors()); */

app.use(cors({
    origin: ["https://whitedove.netlify.app","http://localhost:5173"],
    allowedHeaders:['Content-Type', 'Authorization','Connection'],
    credentials:true,
  }));

const myObject = {};
require("dotenv").config({ processEnv: myObject });
const secret_key = process.env.SECRET_KEY || myObject.SECRET_KEY;

//si no se utiliza esta middleware el post object resulta undefined
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const prismaSessionStore = new PrismaSessionStore(new PrismaClient(), {
  checkPeriod: 2 * 60 * 1000, //ms
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

app.use(
  session({
    cookie: {
      SameSite: "None",
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day - 24hrs/1day - 60min/1hrs - 60seg/1min - 1000ms/1seg
      },
    secret: secret_key,
    resave: true,
    saveUninitialized: true,
    store: prismaSessionStore,
  })
);

// Call prune() to remove expired sessions
prismaSessionStore.prune();

// se debe inicializar cada sesion
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/", routes.homepage);
app.use("/sign_up", routes.signup);
app.use("/login", routes.login);
app.use("/login_as_guest", routes.login_as_guest); 
app.use("/logout", routes.logout);
app.use("/chats", routes.chat);
app.use("/messages", routes.message);
app.use("/users", routes.user);
app.use("/profiles",routes.profile);

// error page
app.use((req, res) => res.status(404).json({
  message: "oops page not found :)",
  title: "error page"
}));

app.listen(port, host, () => {
  console.log(`Server is running on ${host}:${port}`);
});
