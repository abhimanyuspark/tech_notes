const whiteList = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://tech-notes-react.vercel.app", // Fix: This should be the frontend URL
];

const corsOptions = {
  origin: (origin, callBack) => {
    if (!origin || whiteList.includes(origin)) {
      callBack(null, true);
    } else {
      callBack(new Error("Not Allowed By CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;
