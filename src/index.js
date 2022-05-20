const express = require("express");
// Para montar los datos procedentes del formulario en la solicitud entrante
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require('fs');


// settings and constants
app.set("port", 3000);
const bookmarksFile = 'src/public/bookmarks/bookmarks.json'

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

    // Si el archivo no existe
    // se inicializa con nuestra configuracion
    if (!fs.existsSync(bookmarksFile)) {
      var newNumBookmarks = '{ "numBookmarks": 0 }';
      fs.writeFileSync(bookmarksFile, newNumBookmarks);
    }
    var jsonBookmarks = fs.readFileSync(bookmarksFile)
    var objBookmarks = JSON.parse(jsonBookmarks);
    
    cb(null, `bookmarks/${objBookmarks["numBookmarks"]}.${ext}`);
  },
});

// Filtro para Multer (solo png y jpg)
const multerFilter = (req, file, cb) => {
  const ext = file.mimetype.split("/")[1];
  // JPG es exactamente lo mismo que JPEG pero se utiliza abreviado con estas tres letras
  if (ext === "png" | ext == "jpeg" | ext == "webp") {
    cb(null, true);
  } else {
    cb(new Error("Not a png/jpg/webp File!!"), false);
  }
};

// Llama a Multier con nuestra configuracion y filtro
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// routes
// si no se sube ningun archivo multer no guarda nada ni genera excepciones
app.post("/upload_bookmark", upload.single("files"), async (req, res) => {
  /* Prueba datos (objetos) formulario */
  //console.log(req.body);
  //console.log(req.file);

  /* Objetivo */
  //let prototipo = fs.readFileSync('src/public/bookmarks/prototipo.json');
  //let jsonPrototipo = JSON.parse(prototipo);
  //console.log(jsonPrototipo);
  //console.log(jsonPrototipo["numBookmarks"]);

  // Bookmarks se ha construido al realizar la subida del archivo
  var jsonBookmarks = fs.readFileSync(bookmarksFile)
  var objBookmarks = JSON.parse(jsonBookmarks);
  try {
    // Se anhade la imagen con su extension al marcador
    const ext = req.file.mimetype.split("/")[1];
    req.body["image"] = objBookmarks["numBookmarks"] + "." + ext;
  } catch (e) {
    // Se anhade la imagen POR DEFECTO con su extension al marcador
    req.body["image"] = "default.jpg";
  }
  // Se anhade el nuevo marcador
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
