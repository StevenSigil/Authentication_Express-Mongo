//jshint esversion:6

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");  // Changed to md5 hash encryption.
const md5 = require('md5');

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User model - Schema for DB to follow
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

//    Now using md5 hash encryption.
// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

// New user POST req.
app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets"); // Only render secrets if no error - not a get req
    }
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === md5(password)) {
          res.render("secrets");
        } else res.sendStatus(403)
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on localhost:3000");
});
