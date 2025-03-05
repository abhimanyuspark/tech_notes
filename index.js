require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const { logger, errLogger } = require("./middlewares/logger");
const corsOptions = require("./config/cors");
const connectDB = require("./config/DB_connect");
const PORT = process.env.PORT;

connectDB();

//////////*** middlewars start ****/////////

// app.use(logger);
app.use(cors(corsOptions)); // ✅ Apply CORS before routes
// Handle preflight requests manually (optional)
app.options("*", cors(corsOptions));

app.use("/", express.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", express.json());

app.use(cookieParser());

//////////*** middlewars end ****/////////
//////////*** routes start ****/////////

app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/auth_routes"));
app.use("/users", require("./routes/user_routes"));
app.use("/notes", require("./routes/note_routes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    const file = path.join(__dirname, "views", "404.html");
    res.sendFile(file);
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

//////////*** routes end ****/////////
//////////*** middlewars start ****/////////

// app.use(errLogger);

//////////*** middlewars end ****/////////

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
  });
});
