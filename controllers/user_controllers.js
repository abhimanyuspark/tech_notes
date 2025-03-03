const User = require("../models/User");
const Note = require("../models/Note");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

const getAllUsers = asyncHandler(async (_, res) => {
  const result = await User.find().select("-password").lean();
  if (!result) {
    return res.status(204).json({ message: "No Data Found" });
  }
  res.json(result);
});

const createUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "Details Are Required" });
  }

  const dup = await User.findOne({ username }).lean().exec();
  if (dup) {
    return res.status(409).json({ message: "User Already Exists" });
  }

  const hashpwd = await bcrypt.hash(password, 10);

  const result = await User.create({
    username,
    password: hashpwd,
    roles,
  });
  if (result) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, active } = req.body;

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "Details Are Required" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }

  const dup = await User.findOne({ username }).lean().exec();
  if (dup && dup._id.toString() !== id) {
    return res.status(409).json({ message: "User Already Exists" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const result = await user.save();
  return res.json(result);
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  if (!id) {
    res.status(400).json({ message: "Id is required" });
  }

  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ messqage: "User Not Found" });
  }

  const result = await user.deleteOne();
  res.json(result);
});

const deleteMultipleUsers = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({
      message: "Ids parameter is required and should be an array",
    });
  }

  // Check if users have assigned notes
  const usersWithNotes = await Note.find({ user: { $in: ids } })
    .lean()
    .exec();
  if (usersWithNotes.length > 0) {
    return res
      .status(400)
      .json({ message: "One or more users have assigned notes" });
  }

  // Proceed with deletion
  const result = await User.deleteMany({ _id: { $in: ids } });

  if (result.deletedCount === 0) {
    return res
      .status(404)
      .json({ message: "No users found with the provided IDs" });
  }

  res.json({ message: `${result.deletedCount} users deleted successfully` });
});

const getUser = asyncHandler(async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Id parameter is required" });
  }

  const result = await User.findOne({ _id: req.params.id })
    .select("-password")
    .exec();
  if (!result) {
    return res.status(204).json({ message: "User not Found" });
  }

  res.json(result);
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  deleteMultipleUsers,
  getUser,
};
