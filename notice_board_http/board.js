function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

async function getUser() {
  // 로딩 시 사용자 가져오는 함수
  try {
    const res = await axios.get("/users");
    const res_session = await axios.get("/session");

    const users = res.data;

    const list = document.getElementById("list");
    list.innerHTML = "";
    // 사용자마다 반복적으로 화면 표시 및 이벤트 연결
    Object.keys(users).map(function (key) {
      const userDiv = document.createElement("div");
      const span = document.createElement("span");

      if (users[key]["name"] !== "") {
        span.textContent = users[key]["id"] + ":" + users[key]["name"];
      } else {
        span.textContent = "";
      }
      const edit = document.createElement("button");
      edit.textContent = "수정";
      edit.addEventListener("click", async () => {
        // 수정 버튼 클릭
        if (
          res_session.data[document.cookie.split("=")[1]]["id"] ===
          users[key]["id"]
        ) {
          const name = prompt("바꿀 이름을 입력하세요");
          if (!name) {
            return alert("이름을 반드시 입력하셔야 합니다");
          }
          try {
            await axios.put("/user/" + key, { name });
            getUser();
          } catch (err) {
            console.error(err);
          }
        } else {
          window.alert("허락된 사용자가 아닙니다.(수정메세지)");
        }
      });
      const remove = document.createElement("button");
      remove.textContent = "삭제";
      remove.addEventListener("click", async () => {
        // 삭제 버튼 클릭
        if (
          res_session.data[document.cookie.split("=")[1]]["id"] ===
          users[key]["id"]
        ) {
          try {
            await axios.delete("/user/" + key);
            getUser();
          } catch (err) {
            console.error(err);
          }
        } else {
          window.alert("허락된 사용자가 아닙니다.(삭제메세지)");
        }
      });
      if (users[key]["name"] !== "") {
        userDiv.appendChild(span);
        userDiv.appendChild(edit);
        userDiv.appendChild(remove);
      }
      list.appendChild(userDiv);
    });
  } catch (err) {
    console.error(err);
  }
}

window.onload = getUser; // 화면 로딩 시 getUser 호출
setInterval(getUser, 500);
// 폼 제출(submit) 시 실행
document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = e.target.username.value;
  if (!name) {
    return alert("이름을 입력하세요");
  }
  try {
    await axios.post("/user", { name });
    getUser();
  } catch (err) {
    console.error(err);
  }
  e.target.username.value = "";
});
