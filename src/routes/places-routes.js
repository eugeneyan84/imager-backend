import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('GET request in places');
  res.json({ time: new Date(), message: 'Msg received at places routes!' });
});

export default router;
