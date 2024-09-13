const path = require("path");
const fs = require("fs");
const { readBookmarks, saveBookmarks } = require("../utils/fileUtils");
const { bookmarksDir } = require("../config");
const entities = require("html-entities");

const uploadBookmark = (req, res) => {
  try {
    const objBookmarks = readBookmarks();
    let id = parseInt(req.body.id);

    if (!validateBookmarkId(id, objBookmarks.numMaxId)) {
      return res.status(400).json({ error: "El marcador necesita un id válido" });
    }

    const title = sanitizeInput(req.body.title);
    const url = sanitizeInput(req.body.url);

    if (id === -1) {
      if (!url) {
        return res.status(400).json({ error: "El marcador necesita una URL" });
      }

      id = objBookmarks.numMaxId++;
      objBookmarks.numBookmarks++;
      req.body.image = req.file ? `${id}.${req.file.mimetype.split("/")[1]}` : "../img/default.jpg";
      objBookmarks[id] = { title, url, image: req.body.image };
    } else {
      if (title) objBookmarks[id].title = title;
      if (url) objBookmarks[id].url = url;
      if (req.file) objBookmarks[id].image = `${id}.${req.file.mimetype.split("/")[1]}`;
    }

    saveBookmarks(objBookmarks);
    res.json({ message: "Marcador recibido satisfactoriamente" });
  } catch (error) {
    console.error("Error al procesar el bookmark:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const deleteBookmark = (req, res) => {
  try {
    const objBookmarks = readBookmarks();
    let id = parseInt(req.body.id);

    if (!validateBookmarkId(id, objBookmarks.numMaxId)) {
      return res.status(400).json({ error: "El marcador necesita un id válido" });
    }

    if (objBookmarks[id]) {
      deleteBookmarkImage(objBookmarks[id].image);
      delete objBookmarks[id];
      objBookmarks.numBookmarks--;
      saveBookmarks(objBookmarks);
      res.json({ message: "Marcador eliminado satisfactoriamente" });
    } else {
      res.status(404).json({ error: "Marcador no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el marcador:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const validateBookmarkId = (id, maxId) => {
  return !(id == null || id === "" || id > maxId || id < -1);
};

const sanitizeInput = (input) => entities.encode(input ? input.toString() : "");

const deleteBookmarkImage = (image) => {
  if (image && image !== "../img/default.jpg") {
    const imagePath = path.join(bookmarksDir, image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
};

module.exports = {
  uploadBookmark,
  deleteBookmark,
  validateBookmarkId,
};
