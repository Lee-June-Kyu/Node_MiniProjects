const express = require("express");
const User = require("../models/user");
const Session = require("../models/session");

const router = express.Router();

function isSessionKey(key) {
  for (sessionKey in global.data.sessions) {
    if (key === sessionKey) {
      return true;
    }
  }
  return false;
}

// GET / 라우터
router.post("/", async (req, res, next) => {
  try {
    // 클라이언트에서 보낸 데이터 저장
    const { id, password } = req.body;
    // 유저 테이블에서 userId 컬럼을 사용자가 보낸 id로 찾아옴
    const user = await User.findOne({ where: { userId: id } });
    // id로 찾은 사용자가 존재 && 찾은 사용자의 비밀번호와 보내온 데이터(password)가 일치한다면
    if (user && user.password === password) {
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 1000);
      let session = await Session.findOne({ where: { userId: user.id } });
      if (session) {
        await Session.update(
          {
            expires,
          },
          {
            where: { id: session.id },
          }
        );
      } else {
        session = await Session.create({
          userId: user.id,
          expires,
        });
      }
      res.cookie("key", session.id, { expires });
      res.redirect("/chat/room");
    } else {
      res.send("회원 정보가 일치하지 않습니다. id/pw를 확인하여 주세요.");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
