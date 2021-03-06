import express from 'express';
import db from '../db';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import passport from 'passport';

const router = express.Router();

router.get('/', (req, res) => {
  const { user } = req;
  if (user) return res.json({ user });
  return res.status(401).json('자동 로그인 실패');
});

router.post('/register', async (req, res, next) => {
  const { email, password } = req.body;
  const [[existEmail]] = await db.query(
    `SELECT EXISTS (SELECT * FROM users WHERE email='${email}') as exist`
  );
  if (existEmail.exist) return res.status(409).json('아이디가 존재합니다');
  const id = uuidv4();
  const hash = await bcrypt.hash(password, 10);
  try {
    await db.query(
      `INSERT INTO users(id, email, password) VALUES('${id}', '${email}', '${hash}')`
    );
    return res.json('회원가입 완료');
  } catch (e) {
    console.error('register error', e);
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(409).json('아이디 또는 비밀번호가 틀립니다');
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/auth');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  // res.redirect('/auth');
  return res.json('로그아웃');
});

export default router;
