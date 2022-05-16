const express = require("express");
// Para montar los datos procedentes del formulario en la solicitud entrante
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const multer = require("multer");

// settings
app.set("port", 3000);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Configuracion para Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `bookmarks/${file.fieldname}-${Date.now()}.${ext}`);
  },
});

// Filtro para Multer (solo png y jpg)
const multerFilter = (req, file, cb) => {
  const ext = file.mimetype.split("/")[1];
  // JPG es exactamente lo mismo que JPEG pero se utiliza abreviado con estas tres letras
  if (ext === "png" | ext == "jpeg" | ext == "webp") {
    cb(null, true);
  } else {
    cb(new Error("Not a png/jpg File!!"), false);
  }
};

// Llama a Multier con nuestra configuracion y filtro
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// routes
app.post("/upload_bookmark", upload.single("files"), async (req, res) => {
  //console.log(req.body);
  //console.log(req.file);
  res.json({ message: "Successfully uploaded files" });
});

// static files
app.use(express.static(path.join(__dirname, "public")));

// listening the Server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
