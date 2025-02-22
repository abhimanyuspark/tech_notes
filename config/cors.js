const whiteList = [
  "http://localhost:3000",
  "https://www.google.co.in",
  "https://www.google.com",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, callBack) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callBack(null, true);
    } else {
      callBack("Not Allwed By Cors");
    }
  },
  credentials: true,
};

module.exports = corsOptions;
