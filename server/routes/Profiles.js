const express = require("express");
const app = express();
const axios = require("axios");
const firebase = require("../firebase.js");
const { GiEmberShot } = require("react-icons/gi");
const admin = firebase.admin;
const db = firebase.db;

app.post("/create-profile", (req, res) => {
  const { name, picture, userId } = req.body;

  db.collection(userId)
    .doc(name)
    .set({ picture: picture, list: [] })
    .then(() => {
      res.status(200).send("Profile Created");
    });
});

app.post("/get-profiles", async (req, res) => {
  const { name, picture, userId } = req.body;
  var data = [];
  const profiles = await db.collection(userId).get();

  profiles.forEach((profile) => {
    data.push({ name: profile.id, data: profile.data() });
  });

  res.json(data);
});

app.post("/add-item", (req, res) => {
  const { showId, userId, name, type } = req.body;

  const userDocRef = db.collection(userId).doc(name);

  userDocRef
    .update({
      list: admin.firestore.FieldValue.arrayUnion({
        showId: showId,
        type: type,
      }),
    })
    .then(() => {
      res.status(200).send("Show added");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/remove-item", (req, res) => {
  const { showId, userId, name } = req.body;

  const userDocRef = db.collection(userId).doc(name);
  userDocRef
    .remove({ list: admin.firestore.FieldValue.arrayRemove(showId) })
    .then(() => {
      res.status(200).send("Show removed");
    });
});

app.post("/my-list", async (req, res) => {
  const { userId, name } = req.body;
  var list_items = [];

  const userDocRef = db.collection(userId).doc(name);

  await userDocRef.get().then(async (doc) => {
    const { list } = doc.data();

    await Promise.all(
      list.map(async (item) => {
        await axios
          .get(
            `${process.env.moviesApiURL}/${item.type}/${item.showId}${process.env.apiKey}`
          )
          .then((res) => {
            list_items.push(res.data);
          });
      })
    );
  });

  res.json(list_items);
});

module.exports = app;
