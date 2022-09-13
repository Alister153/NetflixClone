require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const path = require("path");
const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "/client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname1, 'client', 'build', 'index.html'), (err) => {
    if (err) res.status(500).send(err);
  });
});

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/api/profile", require("./routes/Profiles"));
app.use("/api/movies", require("./routes/Movies.js"));
app.use("/api/login", require("./routes/LoginRoutes.js"));

app.listen(PORT, () => {
  console.log("listening on " + PORT);
});
