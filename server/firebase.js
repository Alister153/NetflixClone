var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.js");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://netfl-432e5-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

module.exports = { admin: admin, db: db };
