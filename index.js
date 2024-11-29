const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.model.js");
const { signIn, logout, register } = require("./controllers/user.controller.js");

// MongoDB connection
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/disaster", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB.");
}

// Initialize app
const app = express();
const PORT = 3000;

// Set up view engine and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
const store = MongoStore.create({
  mongoUrl: "mongodb://127.0.0.1:27017/guardia",
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600, // Avoid frequent session updates
});

const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3, // 3 days
    maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  },
};

app.use(session(sessionOptions));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass user to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Routes

// Home route
app.get("/", (req, res) => {
  res.render("index.ejs", { user: req.user });
});

// Registration route
app.post("/register", register);

// Login route
app.post("/login", signIn);

// Logout route
app.get("/logout", logout);

// Additional routes
app.get("/sos", (req, res) => {
  res.render("page1.ejs");
});

app.get("/home", (req, res) => {
  res.render("page2.ejs");
})

app.get("/map", (req, res) => {
  res.render("map.ejs");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
  main().catch((err) => console.log(err));
});
