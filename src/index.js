const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: "bookmarks/" });

// settings
app.set("port", 3000);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.post("/upload_bookmark", upload.single("files"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    res.json({ message: "Successfully uploaded files" });
});

// static files
app.use(express.static(path.join(__dirname, "public")));

// listening the Server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
