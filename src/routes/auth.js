import express from 'express';

const router = express.Router();

router.get('/register', (req, res) => {
  return res.json('success');
});

export default router;
