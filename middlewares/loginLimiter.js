const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute)
  message: { message: "Too many requests, please try again later." }, // ...
  handler: (req, res, next, options) => {
    logEvents(
      `Too many request: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errlogs.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = loginLimiter;
