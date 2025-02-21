const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader?.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Forbidden" });
    } else {
      req.username = decoded.userInfo.username;
      req.roles = decoded.userInfo.roles;
      next();
    }
  });
};

module.exports = verifyJWT;
