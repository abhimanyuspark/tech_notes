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

router.delete("/:id", deleteUser);

router.route("/delete_multiple").delete(deleteMultipleUsers);

router.get("/:id", getUser);

module.exports = router;
