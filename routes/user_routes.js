const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  deleteMultipleUsers,
  getUser,
} = require("../controllers/user_controllers");
const verifyJWT = require("../middlewares/verifyJWT");

router.use(verifyJWT);

router.route("/").get(getAllUsers).post(createUser).put(updateUser);

router.delete("/delete_multiple", deleteMultipleUsers);

router.delete("/:id", deleteUser);

router.get("/:id", getUser);

module.exports = router;
