const express = require("express");
const router = express.Router();
const {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  getNote,
} = require("../controllers/note_controllers");

router
  .route("/")
  .get(getAllNotes)
  .post(createNote)
  .put(updateNote)
  .delete(deleteNote);

router.route("/:id").get(getNote);

module.exports = router;
