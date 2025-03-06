const whiteList = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://tech-notes-beta.vercel.app",
  "https://tech-notes-react.vercel.app", // Fix: This should be the frontend URL
];

const corsOptions = {
  origin: (origin, callBack) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callBack(null, true);
    } else {
      callBack(`Not Allowed By Cors`);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;
