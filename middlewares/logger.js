const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const logEvents = async (message, logFileName) => {
  const date = format(new Date(), "dd/MM/yyyy\thh:mm:ss");
  const data = `${date}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      data
    );
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  const message = `${req.method}\t${req.url}\t${req.headers.origin}`;
  logEvents(message, "logs.log");
  next();
};

const errLogger = (err, req, res, next) => {
  const message = `${err.name} : ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`;
  logEvents(message, "errlogs.log");
  res.status(500).json({ message: err.message });
  next();
};

module.exports = { logEvents, logger, errLogger };
