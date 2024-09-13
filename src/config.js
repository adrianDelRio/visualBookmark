const path = require("path");

// Configuración del puerto del servidor
const PORT = process.env.PORT || 3000;

// Rutas de archivos de bookmarks
const bookmarksDir = path.join(__dirname, "public/bookmarks");
const bookmarksFile = path.join(bookmarksDir, "bookmarks.json");

module.exports = {
  PORT,
  bookmarksDir,
  bookmarksFile,
};
