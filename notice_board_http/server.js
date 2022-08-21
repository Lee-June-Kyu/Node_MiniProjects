const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

function findKeyInSession(cookiekey) {
  let answer = false;
  console.log(Object.values(session));
  Object.values(session).forEach((sessionValue) => {
    if (sessionValue['id'] === cookiekey) {
      answer = true;
    }
  });

  return answer;
}

function loginAction(cookieid, cookiepw) {
  let answer = false;
  console.log(Object.values(session));
  Object.values(session).forEach((sessionValue) => {
    if (sessionValue['id'] === cookieid && sessionValue['pw'] === cookiepw) {
      answer = true;
    }
  });

  return answer;
}

const session = {};
const users = {};

http
  .createServer(async (req, res) => {
    try {
      console.log(req.method, req.url);
      // GET 요청시
      if (req.method === 'GET') {
        if (req.url === '/') {
          const data = await fs.readFile('./index.html');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        } else if (req.url === '/login.html') {
          const data = await fs.readFile('./login.html');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        } else if (req.url === '/signup.html') {
          const data = await fs.readFile('./signup.html');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        } else if (req.url.startsWith('/signupAction')) {
          // res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          // res.write('<h2>Hello Signup Button</h2>');
          // res.end();
          const cookies = parseCookies(req.headers.cookie);
          const { query } = url.parse(req.url);
          const { id, pw } = qs.parse(query);
          // 세션에 id가 똑같은게 있으면 같은 아이디가 존재합니다. 라는 창을 띄움
          if (findKeyInSession(id)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

            res.write('<h2>이미 사용중인 id 입니다.</h2>');
            res.write(
              '<button onclick="location.href=\'index.html\'">첫화면</button >'
            );
            res.write(
              '<button onclick="location.href=\'signup.html\'">회원가입</button >'
            );
            console.log('이미 있는 id임');
            res.end();
          }
          // 세션에 id가 똑같은게 없다면 세션에 아이디를 추가해준다.
          else {
            console.log(query, id, pw, cookies, session);
            const expires = new Date();
            expires.setMinutes(expires.getMinutes() + 1);
            const uniqueInt = Date.now();
            session[uniqueInt] = {
              id,
              pw,
              expires,
            };
            // console.log('1, ' + cookies);
            // res.writeHead(302, {
            //   Location: '/login.html',
            //   'Set-Cookie': `session=${uniqueInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
            // });
            res.writeHead(200, {
              'Content-Type': 'text/html; charset=utf-8',
              'Set-Cookie': `session=${uniqueInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
            });
            res.write(`<h2>${id}님의 회원가입을 축하합니다 !!!!</h2>`);
            res.write(
              '<button onclick="location.href=\'index.html\'">첫화면</button >'
            );
            res.write(
              '<button onclick="location.href=\'login.html\'">로그인</button >'
            );
            // console.log('1, ' + cookies);
            res.end();
          }
        } else if (req.url.startsWith('/loginAction')) {
          const cookies = parseCookies(req.headers.cookie);
          const { query } = url.parse(req.url);
          const { id, pw } = qs.parse(query);
          // id와 pw가 세션에 있을 경우 로그인 성공
          if (loginAction(id, pw)) {
            const data = await fs.readFile('./board.html');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
          }
          // id와 pw가 세션에 없을 경우 로그인 실패
          else {
            res.writeHead(302, { Location: '/login.html' });
            res.end();
          }
        } else if (req.url === '/users') {
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
          });
          return res.end(JSON.stringify(users));
        } else if (req.url === '/session') {
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
          });
          return res.end(JSON.stringify(session));
        }
        try {
          const data = await fs.readFile(`.${req.url}`);
          return res.end(data);
        } catch (err) {}
        res.writeHead(404);
        return res.end('Not Found');
      }
      // POST 요청시
      else if (req.method === 'POST') {
        if (req.url === '/user') {
          let body = '';
          // 요청의 body를 stream 형식으로 받음
          req.on('data', (data) => {
            body += data;
          });
          // 요청의 body를 다 받은 후 실행됨
          return req.on('end', () => {
            console.log('POST 본문(Body):', body);
            const { name } = JSON.parse(body);
            const id = Date.now();
            users[id] = name;
            res.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('ok');
          });
        }
      } else if (req.method === 'PUT') {
        if (req.url.startsWith('/user/')) {
          const key = req.url.split('/')[2];
          let body = '';
          req.on('data', (data) => {
            body += data;
          });
          return req.on('end', () => {
            console.log('PUT 본문(Body):', body);
            users[key] = JSON.parse(body).name;
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('ok');
          });
        }
      } else if (req.method === 'DELETE') {
        if (req.url.startsWith('/user/')) {
          const key = req.url.split('/')[2];
          delete users[key];
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end('ok');
        }
      }
    } catch (err) {
      console.log(err);
      res.writeHead(500, { 'Content-Type': 'text/plan; charset=utf-8' });
      res.end(err.message);
    }
  })
  .listen(8081, () => {
    console.log('8081번 포트에서 서버 대기 중입니다.');
  });
