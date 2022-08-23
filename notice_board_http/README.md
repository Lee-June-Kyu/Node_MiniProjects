# HTTP 모듈을 사용해서 구현하는 게시판

## 핵심기능
1. Node의 http 모듈을 이용한 서버 구현
2. 세션,쿠키를 이용한 회원가입과 로그인
3. CRUD를 이용한 RESTful한 게시판(채팅) 만들기
 
---

### 1. Node의 http 모듈을 이용한 서버 구현
server.js에서 http 모듈을 이용해서 서버를 작동시킨다. ( GET은 연결 , POST는 생성 , PUT은 수정 , DELETE는 삭제 ) </br>
server.js에서 session을 관리한다. </br>

### 2. 세션, 쿠키를 이용한 회원가입과 로그인
세션은 서버에 존재하고 쿠키는 클라이언트에게 존재한다. </br>
회원가입시에는 유저의 정보를 세션에 저장해주고, 로그인시에는 세션에 있는 정보와 쿠키의 정보를 비교해서 로그인 해준다. </br>
- 회원가입 페이지
</br>
![image](https://user-images.githubusercontent.com/80251711/186040268-30c2300a-3b26-4ec8-9047-d392c2277372.png) </br>

- 로그인 페이지
</br>
![image](https://user-images.githubusercontent.com/80251711/186040308-e07b432b-3100-4e82-a49e-0312b51ccb8a.png) </br>


### 3. CRUD를 이용한 RESTful한 게시판(채팅) 만들기
