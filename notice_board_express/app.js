const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
const Session = require("./models/session");

dotenv.config();

// 추가
// const passport = require("passport");
const { sequelize } = require("./models");
// const passportConfig = require("./passport");

const indexRouter = require("./routes");
const userRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const chatRouter = require("./routes/chat");

const app = express();
// passportConfig();
app.set("port", process.env.PORT || 3000);
// app.set('port', 3001);

//시퀄라이즈 쓸 때
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });
// end sequlize

app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);
// app.use(passport.initialize());
// app.use(passport.session());

//로그인이 안 됐을 때(cookie가 없을 때)
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/login", loginRouter);
////////////////////////end

//로그인이 돼서 req.cookie가 존재할 때
app.use(async (req, res, next) => {
  try {
    const cookieKey = req.cookies.key;

    if (cookieKey && (await Session.findOne({ where: { id: cookieKey } }))) {
      next();
    } else {
      res.redirect("/");
    }
  } catch (error) {
    next(error);
  }
});
app.use("/chat", chatRouter);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
