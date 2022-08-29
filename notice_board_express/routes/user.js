const express = require("express");
const path = require("path");
const User = require("../models/user");

const router = express.Router();

// GET /user 라우터
router.get("/join", (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "../views/join.html"));
});

// post
router.post("/join", async (req, res, next) => {
  try {
    console.log("###########################33");
    console.log(req.body);
    const { id, age, name, comment, password } = req.body;

    if (!(await User.findOne({ where: { userId: id } }))) {
      await User.create({
        userId: id,
        age,
        name,
        comment,
        password,
      });

      res.send(200, `회원가입이 완료 되었습니다. ${name}님 환영합니다.`);
    } else {
      res.send(201, `중복된 id가 존재합니다.`);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
