const express = require("express");
const path = require("path");
const { initializeBookmarks } = require("./utils/fileUtils");
const bookmarksRoutes = require("./routes/bookmarksRoutes");
const { PORT } = require("./config");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar los bookmarks al iniciar el servidor
initializeBookmarks();

// Rutas
app.use("/api/bookmarks", bookmarksRoutes);

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
