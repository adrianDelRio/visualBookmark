const express = require("express");
// Para montar los datos procedentes del formulario en la solicitud entrante
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require('fs');


// settings and constants
app.set("port", 3000);
const bookmarksDir = 'src/public/bookmarks'
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

    // Si no existe la carpeta bookmarks se crea
    // y se inicializa con nuestra configuración
    if (!fs.existsSync(bookmarksDir) || !fs.existsSync(bookmarksFile)) {
      fs.mkdirSync(bookmarksDir);
      var newNumBookmarks = '{ "numBookmarks": 0, "numMaxId": 0 }';
      fs.writeFileSync(bookmarksFile, newNumBookmarks);
    }

    // Leemos el archivo de datos
    var jsonBookmarks = fs.readFileSync(bookmarksFile)
    var objBookmarks = JSON.parse(jsonBookmarks);

    // Si el marcador NO tiene ID VALIDO no lo aceptamos
    // -1 es el identificador para los nuevos marcadores
    // Los nuevos marcadores se almacenan como en una pila (seguidos del anterior)
    var id = parseInt(req.body.id);
    if (id == null | id == '' | id > objBookmarks["numMaxId"] | id < -1) {
      cb(new Error("El marcador necesita un id valido"), false);
    }

    // Si es un nuevo marcador lo anhadimos
    if (id == -1) {
      // Guardamos el id para este marcador (segun la pila de marcadores)
      id = objBookmarks["numMaxId"];
    } else {  // Editamos un marcador existente
      // El identificador ya esta seleccionado por el usuario

      // Eliminamos la antigua imagen (ya que solo
      // se entra a este metodo si hay una nueva imagen)
      fs.unlinkSync("./" + bookmarksDir + "/" + objBookmarks[id].image);
    }

    // Guardamos nueva la imagen
    var ext = file.mimetype.split("/")[1];
    var imagen = id + '.' + ext;
    cb(null, `bookmarks/${imagen}`);
  },
});

// Filtro para Multer
const multerFilter = (req, file, cb) => {
  const ext = file.mimetype.split("/")[1];
  // JPG es exactamente lo mismo que JPEG pero se utiliza abreviado con estas tres letras
  if (ext === "png" | ext == "jpeg" | ext == "webp") {
    cb(null, true);
  } else {
    cb(new Error("No es un archivo png/jpg/webp"), false);
  }
};

// Llama a Multier con nuestra configuracion y filtro
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// routes
// si no se sube ningun archivo multer no se ejecuta
app.post("/upload_bookmark", upload.single("files"), async (req, res) => {
  /* Prueba datos (objetos) formulario */
  //console.log(req.body);
  //console.log(req.file);

  // Bookmarks se ha construido al realizar la subida del archivo
  var jsonBookmarks = fs.readFileSync(bookmarksFile)
  var objBookmarks = JSON.parse(jsonBookmarks);

  // Si el marcador NO tiene ID VALIDO no lo aceptamos
  // -1 es el identificador para los nuevos marcadores
  // Los nuevos marcadores se almacenan como en una pila (seguidos del anterior)

  var id = parseInt(req.body.id);
  if (id == null | id == '' | id > objBookmarks["numMaxId"] | id < -1) {
    res.status(400).json({ error: 'El marcador necesita un id valido' });
    return;
  }

  // Parse url to string
  var title = req.body.title.toString();
  var url = req.body.url.toString();

  // Si es un nuevo marcador lo anhadimos
  if (id == -1) {
    // El id NO es relevante, asi que lo borramos
    delete req.body.id;
    // Guardamos el id para este marcador (segun la pila de marcadores)
    id = objBookmarks["numMaxId"];
    // Ajustamos el id para el siguiente marcador
    objBookmarks["numMaxId"]++;
    // Ajustamos el numero de marcadores
    objBookmarks["numBookmarks"]++;

    // Si el nuevo marcador NO tiene URL no lo aceptamos
    if (url == null | url == '') {
      res.status(400).json({ error: 'El marcador necesita una url' });
      return;
    }

    // Si el nuevo marcador tiene imagen
    if (req.file != null) {
      // Se anhade la imagen con su extension al marcador
      const ext = req.file.mimetype.split("/")[1];
      req.body["image"] = id + "." + ext;
    } else {  // Sino tiene imagen
      // Se anhade la imagen POR DEFECTO al marcador
      req.body["image"] = "../img/default.jpg";
    }

      // Se anhade el marcador solo con nuestro titulo, url e imagen
      // (independientemente del resto de datos de la petición)
      objBookmarks[id] = {};
      objBookmarks[id].title = title;
      objBookmarks[id].url = url;
      objBookmarks[id].image = req.body.image;
  } else {  // Editamos un marcador existente
    // El identificador ya esta seleccionado por el usuario

    // No queremos guardar el id dentro del objeto, asi que lo borramos
    delete req.body.id;
    // Como estamos editando un marcador, el id para el siguiente marcador ya esta ajustado

    // Si el marcador editado envia un titulo lo actualizamos
    if (title != null) {
      objBookmarks[id].title = title;
    }
    // Si el marcador editado envia una url la actualizamos
    if (url != null) {
      objBookmarks[id].url = url;
    }
    // Si el marcador editado envia una imagen la actualizamos
    if (req.file != null) {
      // Se anhade la imagen con su extension al marcador
      const ext = req.file.mimetype.split("/")[1];
      objBookmarks[id].image = id + "." + ext;
    }
  }

  // Se guarda el marcador modificado
  var newBookmarks = JSON.stringify(objBookmarks, null, 2);
  fs.writeFileSync('src/public/bookmarks/bookmarks.json', newBookmarks);

  res.json({ message: "Marcador recibido satisfactoriamente" });
});

app.post("/delete_bookmark", async (req, res) => {
  // Bookmarks se ha construido al realizar la subida del archivo
  var jsonBookmarks = fs.readFileSync(bookmarksFile)
  var objBookmarks = JSON.parse(jsonBookmarks);

  // Si el marcador NO tiene ID VALIDO no lo aceptamos
  // -1 es el identificador para los nuevos marcadores
  // Los nuevos marcadores se almacenan como en una pila (seguidos del anterior)
  var id = parseInt(req.body.id);
  if (id == null | id == '' | id > objBookmarks["numMaxId"] | id < -1) {
    res.status(400).json({ error: 'El marcador necesita un id valido' });
    return;
  }

  // Eliminamos la imagen si no es la imagen por defecto
  if (objBookmarks[id].image != "../img/default.jpg") {
    fs.unlinkSync('src/public/bookmarks/' + objBookmarks[id].image);
  }
  // Eliminamos el marcador
  delete objBookmarks[id];
  // Ajustamos el numero de marcadores
  objBookmarks["numBookmarks"]--;

  // Se guarda el marcador modificado
  var newBookmarks = JSON.stringify(objBookmarks, null, 2);
  fs.writeFileSync('src/public/bookmarks/bookmarks.json', newBookmarks);

  res.json({ message: "Marcador eliminado satisfactoriamente" });
});

// static files
app.use(express.static(path.join(__dirname, "public")));

// listening the Server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
