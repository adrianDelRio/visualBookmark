const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig");
const { uploadBookmark, deleteBookmark } = require("../controllers/bookmarksController");

router.post("/upload", upload, uploadBookmark);
router.post("/delete", deleteBookmark);

module.exports = router;
