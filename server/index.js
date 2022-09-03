require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
const PORT = process.env.PORT;
const path = require("path");
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("App is running");
  });
}
app.use(
  cors({
    origin: "*",
  })
);
app.use("/profile", require("./routes/Profiles"));
app.use("/movies", require("./routes/Movies.js"));
app.use("/login", require("./routes/LoginRoutes.js"));

app.listen(PORT || 3000, () => {
  console.log("listening on " + PORT);
});
