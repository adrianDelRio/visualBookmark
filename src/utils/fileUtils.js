const fs = require("fs");
const { bookmarksDir, bookmarksFile } = require("../config");

// Inicializa la carpeta y el archivo JSON de bookmarks si no existen
const initializeBookmarks = () => {
  if (!fs.existsSync(bookmarksDir)) {
    fs.mkdirSync(bookmarksDir, { recursive: true });
  }
  if (!fs.existsSync(bookmarksFile)) {
    const initialData = { numBookmarks: 0, numMaxId: 0 };
    fs.writeFileSync(bookmarksFile, JSON.stringify(initialData, null, 2));
  }
};

// Lee el archivo de bookmarks
const readBookmarks = () => {
  const jsonBookmarks = fs.readFileSync(bookmarksFile);
  return JSON.parse(jsonBookmarks);
};

// Guarda los bookmarks en el archivo JSON
const saveBookmarks = (data) => {
  fs.writeFileSync(bookmarksFile, JSON.stringify(data, null, 2));
};

module.exports = {
  initializeBookmarks,
  readBookmarks,
  saveBookmarks,
};
