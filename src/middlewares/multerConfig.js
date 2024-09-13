const multer = require("multer");
const path = require("path");
const { readBookmarks } = require("../utils/fileUtils");
const { validateBookmarkId } = require("../controllers/bookmarksController");
const { bookmarksDir } = require("../config");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(bookmarksDir));
  },
  filename: (req, file, cb) => {
    const objBookmarks = readBookmarks();
    let id = parseInt(req.body.id);

    if (!validateBookmarkId(id, objBookmarks.numMaxId)) {
      return cb(new Error("El marcador necesita un id válido"), false);
    }

    if (id === -1) {
      id = objBookmarks.numMaxId;
    }

    const ext = file.mimetype.split("/")[1];
    const imageName = `${id}.${ext}`;
    cb(null, imageName);
  },
});

const multerFilter = (req, file, cb) => {
  const ext = file.mimetype.split("/")[1];
  if (["png", "jpeg", "webp"].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("No es un archivo png/jpg/webp"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single("files");

module.exports = upload;
