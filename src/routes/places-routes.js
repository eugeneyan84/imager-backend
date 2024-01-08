import express from 'express';
import { TEST_PLACES } from '../data/data.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('GET request in places');
  res.json({ time: new Date(), message: 'Msg received at places routes!' });
});

router.get('/:placeId', (req, res, next) => {
  const placeId = req.params.placeId;
  const place = TEST_PLACES.find((p) => {
    return p.id === Number(placeId);
  });

  if (!place) {
    return res
      .status(404)
      .json({ message: 'Could not find a place with the provided id.' });
  }

  res.json({ place });
});

router.get('/user/:userId', (req, res, next) => {
  const userId = req.params.userId;

  const places = TEST_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (places.length === 0) {
    return res.status(404).json({
      message: 'Could not find any places created by the provided user id.',
    });
  }

  res.json({ places });
});

export default router;
