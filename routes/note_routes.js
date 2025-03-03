const express = require("express");
const router = express.Router();
const {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  deleteMultipleNotes,
  getNote,
} = require("../controllers/note_controllers");
const verifyJWT = require("../middlewares/verifyJWT");

router.use(verifyJWT);

router.route("/").get(getAllNotes).post(createNote).put(updateNote);

router.delete("/delete_multiple", deleteMultipleNotes);

router.delete("/:id", deleteNote);

router.route("/:id").get(getNote);

module.exports = router;
