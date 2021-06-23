import express from 'express';
import db from '../db';

const router = express.Router();

router.get('/page/:pageId', async (req, res) => {
  const pageId = req.params.pageId;
  const offset = (pageId - 1) * 10;
  const [postList] = await db.query(
    `SELECT title, content, email from posts JOIN users ON posts.user=users.id ORDER BY posts.id DESC LIMIT 10 OFFSET ${offset};`
  );
  return res.json({ postList });
});

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
