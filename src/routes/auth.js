import express from 'express';
import db from '../db';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import passport from 'passport';

const router = express.Router();

router.get('/', (req, res) => {
  const user = req.user;
  if (user) return res.json({ user });
  return res.status(401).json();
});

router.post('/register', async (req, res, next) => {
  const { email, password } = req.body;
  const [[existEmail]] = await db.query(
    `SELECT EXISTS (SELECT * FROM users WHERE email='${email}') as exist`
  );
  if (existEmail.exist) return res.status(409).json();
  const id = uuidv4();
  const hash = await bcrypt.hash(password, 10);
  try {
    await db.query(
      `INSERT INTO users(id, email, password) VALUES('${id}', '${email}', '${hash}')`
    );
    return res.json();
  } catch (e) {
    console.error('register error', e);
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(409).json();
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/auth');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth');
});

export default router;
