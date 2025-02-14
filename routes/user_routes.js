const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  postUser,
  putUser,
  deleteUser,
  deleteMultipleUsers,
  getUser,
} = require("../controllers/user_controllers");

router
  .route("/")
  .get(getAllUsers)
  .post(postUser)
  .put(putUser)
  .delete(deleteUser);

router.get("/:id", getUser);

module.exports = router;
