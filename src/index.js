const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: "bookmarks/" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// settings
app.set("port", 3000);

// routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.post("/upload_bookmark", upload.single("files"), uploadBookmark);
function uploadBookmark(req, res) {
    console.log(req.body);
    console.log(req.file);
    res.json({ message: "Successfully uploaded files" });
}

// static files
app.use(express.static(path.join(__dirname, "public")));

// listening the Server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
