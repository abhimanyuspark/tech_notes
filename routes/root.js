const express = require("express");
const router = express.Router();
const path = require("path");

router.route("/").get((_, res) => {
  const file = path.join(__dirname, "..", "views", "index.html");
  res.status(200).sendFile(file);
});

module.exports = router;
