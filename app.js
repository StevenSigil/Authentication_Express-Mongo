//jshint esversion:6

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");  // Replaced by session auth. via below.
// const saltRounds = 10;
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require("passport-local-mongoose");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// Creating/configuring the session.
app.use(
  session({
    secret: "A secret key!",
    resave: false,
    saveUninitialized: false,
  })
);
// Initialize passport to handle the session
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true); // Replaced deprecated 'collection.ensureIndex

// User model - Schema for DB to follow
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
// Enable passport local mongoose for the User model.
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

// Serialize/Deserialize the User data/model
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/secrets", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
})

// New user POST req.
app.post("/register", function (req, res) {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets"); // Now a user can still be logged in and go straight to '/secrets'.
        });
      }
    }
  );
});

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local") (req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on localhost:3000");
});
