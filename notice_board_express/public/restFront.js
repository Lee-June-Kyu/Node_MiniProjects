async function getUser() {
  // 로딩 시 사용자 가져오는 함수
  try {
    const res = await axios.get("/chat");

    const messages = res.data;
    const list = document.getElementById("list");
    list.innerHTML = "";
    // 사용자마다 반복적으로 화면 표시 및 이벤트 연결
    messages.map(function (message) {
      const userDiv = document.createElement("div");
      const span = document.createElement("span");
      span.textContent = `${message.updatedAt} ${message.name} (${message.age}) *${message.userComment}* : ${message.comment}`;
      const edit = document.createElement("button");

      edit.textContent = "수정";
      edit.addEventListener("click", async () => {
        // 수정 버튼 클릭
        const name = prompt("바꿀 이름을 입력하세요");
        if (!name) {
          return alert("이름을 반드시 입력하셔야 합니다");
        }
        try {
          await axios.put("./message/" + message.id, { name });
          getUser();
        } catch (err) {
          console.error(err);
        }
      });

      const remove = document.createElement("button");
      remove.textContent = "삭제";
      remove.addEventListener("click", async () => {
        // 삭제 버튼 클릭
        try {
          await axios.delete("./message/" + message.id);
          getUser();
        } catch (err) {
          console.error(err);
        }
      });
      userDiv.appendChild(span);
      userDiv.appendChild(edit);
      userDiv.appendChild(remove);
      list.appendChild(userDiv);
    });
  } catch (err) {
    console.error(err);
  }
}

window.onload = getUser; // 화면 로딩 시 getUser 호출
// 폼 제출(submit) 시 실행
document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const comment = e.target.comment.value;
  if (!comment) {
    return alert("메시지를 입력하세요");
  }
  try {
    await axios.post("/chat", { comment });
  } catch (err) {
    console.error(err);
  }
  e.target.comment.value = "";
});

// setInterval(getUser, 3000);
