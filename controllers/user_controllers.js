const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const user = await User.find();
  if (!user) return res.status(204).json({ message: "No Data Found" });
  res.json(user);
};

const postUser = async (req, res) => {
  if (!req?.body)
    return res.status(400).json({ message: "User details are required" });

  try {
    const result = await User.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
  }
};

const putUser = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Id parameter is required" });

  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) return res.status(204).json({ message: "User not Found" });

  if (req.body?.username) user.username = req.body?.username;
  if (req.body?.active) user.active = req.body?.active;

  const result = await user.save();
  res.json(result);
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Id parameter is required" });

  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) return res.status(204).json({ message: "User not Found" });

  const result = await user.deleteOne({ _id: req.body.id });
  res.json(result);
};

const deleteMultipleUsers = async (req, res) => {
  if (!req?.body?.ids || !Array.isArray(req.body.ids))
    return res
      .status(400)
      .json({ message: "Ids parameter is required and should be an array" });

  const result = await User.deleteMany({ _id: { $in: req.body.ids } });
  if (result.deletedCount === 0)
    return res.status(204).json({ message: "No Users Found" });

  res.json(result);
};

const getUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Id parameter is required" });

  const result = await User.findOne({ _id: req.params.id }).exec();
  if (!result) return res.status(204).json({ message: "User not Found" });

  res.json(result);
};

module.exports = {
  getAllUsers,
  postUser,
  putUser,
  deleteUser,
  deleteMultipleUsers,
  getUser,
};
