import express from 'express';
import db from '../db';

const router = express.Router();

router.get('/register', async (req, res) => {
  const get = await db.query(`SELECT id FROM users`);
  console.log(get);
  return res.json('success');
});

export default router;
