import express from 'express';
import db from '../db';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  const { email, password } = req.body;
  const [[existEmail]] = await db.query(
    `SELECT EXISTS (SELECT * FROM users WHERE email='${email}') as exist`
  );
  if (existEmail.exist)
    return res.json({ status: 409, text: '아이디가 존재합니다' });
  const id = uuidv4();
  const hash = await bcrypt.hash(password, 10);
  try {
    await db.query(
      `INSERT INTO users(id, email, password) VALUES('${id}', '${email}', '${hash}')`
    );
    return res.json({ status: 200, text: '회원가입을 축하합니다' });
  } catch (e) {
    next(e);
  }
});

export default router;
