const express = require("express");
// Para montar los datos procedentes del formulario en la solicitud entrante
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require('fs');


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
  /* Prueba datos formulario */
  //console.log(req.body);
  //console.log(req.file);

  /* Objetivo */
  //let prototipo = fs.readFileSync('src/public/bookmarks/prototipo.json');
  //let jsonPrototipo = JSON.parse(prototipo);
  //console.log(jsonPrototipo);
  //console.log(jsonPrototipo["numBookmarks"]);

  const bookmarksFile = 'src/public/bookmarks/bookmarks.json'
  // Si el archivo no existe
  // se inicializa con nuestra configuracion
  if (!fs.existsSync(bookmarksFile)) {
    var newNumBookmarks = '{ "numBookmarks": 0 }';
    fs.writeFileSync(bookmarksFile, newNumBookmarks);
  }

  // Se anhade el nuevo marcador
  var jsonBookmarks = fs.readFileSync(bookmarksFile)
  var objBookmarks = JSON.parse(jsonBookmarks);
  objBookmarks[objBookmarks["numBookmarks"]] = req.body;
  objBookmarks["numBookmarks"]++;
  var newBookmarks = JSON.stringify(objBookmarks, null, 2);
  fs.writeFileSync('src/public/bookmarks/bookmarks.json', newBookmarks);

  res.json({ message: "Successfully uploaded files" });
});

// static files
app.use(express.static(path.join(__dirname, "public")));

// listening the Server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
