import express from 'express';
import db from '../db';

const router = express.Router();

router.post('/write', async (req, res) => {
  const { user } = req;
  const { title, content } = req.body;
  if (!user) return res.status(401).json('로그인이 필요합니다');
  try {
    const [post] = await db.query(
      `INSERT INTO posts(user, title, content) VALUES('${user.id}', '${title}', '${content}')`
    );
    return res.json({ id: post.insertId });
  } catch (e) {
    console.error('register error', e);
  }
});
export default router;
