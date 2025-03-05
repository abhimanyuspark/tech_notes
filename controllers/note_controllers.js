const Note = require("../models/Note");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const getAllNotes = asyncHandler(async (req, res) => {
  // Get all notes from MongoDB
  const notes = await Note.find().lean();

  // If no notes
  if (!notes?.length) {
    return res.status(400).json({ message: "No notes found" });
  }
  // Add username to each note before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  res.json(notesWithUser);
});

const createNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req?.body;

  // Confirm data
  if (!user || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  // Create and store the new user
  const note = await Note.create({ user, title, text });

  if (note) {
    // Created
    return res.status(201).json(note);
  } else {
    return res.status(400).json({ message: "Invalid note data received" });
  }
});

const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  // Confirm data
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm note exists to update
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title }).lean().exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();

  res.json(updatedNote);
});

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req?.params;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  // Confirm note exists to delete
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
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

const deleteMultipleNotes = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  // Confirm data
  if (!ids || !Array.isArray(ids) || !ids.length) {
    return res.status(400).json({ message: "Note IDs required" });
  }

  // Confirm notes exist to delete
  const notes = await Note.find({ _id: { $in: ids } }).exec();

  if (!notes.length) {
    return res.status(400).json({ message: "No notes found" });
  }

  const result = await Note.deleteMany({ _id: { $in: ids } }).exec();
  res.json(result);
});

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  getNote,
  deleteMultipleNotes, // Add the new function here
};
