const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");

// settings
app.set("port", 3000);

// middlewares
app.use(morgan("dev"));

// routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

// static files
app.use(express.static(path.join(__dirname, "public")));

// listening the Server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
