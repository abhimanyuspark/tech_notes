const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");

const getAllNotes = asyncHandler(async (_, res) => {
  const result = await Note.find().lean();
  if (!result) {
    return res.status(204).json({ message: "No Notes Found" });
  }
  res.json(result);
});

const createNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;
  if (!user || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const result = await Note.create({
    user,
    title,
    text,
  });
  if (result) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ message: "Invalid note data received" });
  }
});

const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Note Not Found" });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const result = await note.save();
  if (result) {
    res.json(result);
  }
});

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }

  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Note Not Found" });
  }

  const result = await note.deleteOne();
  res.json(result);
});

const getNote = asyncHandler(async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Id parameter is required" });
  }

  const result = await Note.findOne({ _id: req.params.id }).exec();
  if (!result) {
    return res.status(204).json({ message: "Note not Found" });
  }

  res.json(result);
});

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  getNote,
};
