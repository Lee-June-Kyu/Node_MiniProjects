const express = require("express");
const path = require("path");
const User = require("../models/user");
const Session = require("../models/session");
const Message = require("../models/message");
// const { nextTick } = require("process");

const router = express.Router();

// GET / 라우터
router.get("/room", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/restFront.html"));
});

router.get("/", async (req, res) => {
  try {
    const messages = await Message.findAll({});
    for (message of messages) {
      const user = await User.findOne({ where: { id: message.userId } });
      message.dataValues.name = user.name;
      message.dataValues.userComment = user.comment;
      message.dataValues.age = user.age;
    }

    // 조인문
    // const messages = await Message.findAll({
    //   include: [{
    //     model: User,
    //   }]
    // })

    res.send(messages);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { comment } = req.body;
    const session = await Session.findOne({ where: { id: req.cookies.key } });
    await Message.create({
      userId: session.userId,
      comment,
    });
    res.send(200, "ok");
  } catch (error) {
    next(error);
  }
});

router.put("/message/:id", async (req, res, next) => {
  try {
    console.log("put들어오니 ?!!!");
    console.log(req.body.name);
    console.log(req.params.id);
    Message.update(
      {
        comment: req.body.name,
      },
      {
        where: { id: req.params.id },
      }
    );

    res.send(200, "ok");
  } catch (error) {
    next(error);
  }
});

router.delete("/message/:id", async (req, res, next) => {
  try {
    console.log("delete들어오니 ?!!!");
    // console.log(req.body.name);
    console.log(req.params.id);

    // 아래처럼 하면 Message.destory is not a function이 나온다.
    Message.destroy({
      where: { id: req.params.id },
    });

    // function Destory() {
    //   Message.destroy({ where: { id: req.params.id } })
    //     .then((result) => {
    //       console.log("삭제 성공: ", result);
    //     })
    //     .catch((err) => {
    //       console.log("삭제 Error: ", err);
    //     });
    // }

    Destory();
    res.send(200, "ok");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
