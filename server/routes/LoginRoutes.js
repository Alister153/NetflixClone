const express = require("express");
const app = express();
const firebase = require("../firebase.js");
const admin = firebase.admin;

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  await admin
    .auth()
    .createUser({
      email: email,
      password: password,
      emailVerified: false,
    })
    .then((response) => {
      res.status(200).send("Account successfully created");
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/email-already-exists":
          res.status(409).send("Email address is already in use");
          break;
        case "auth/invalid-email":
          res.status(409).send("Email address is not valid");
          break;
        case "auth/operation-not-allowed":
          res.status(404).send("Operation not allowed");
          break;
        case "auth/invalid-password":
          res.status(409).send("Password is not strong enough.");
          break;
        default:
          console.log(error);
          break;
      }
    });
});

module.exports = app;
