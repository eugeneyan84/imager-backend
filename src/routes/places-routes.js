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
    const error = new Error('Cound not found a place for the provided id.');
    error.code = 404;
    throw error;
  }

  res.json({ place });
});

router.get('/user/:userId', (req, res, next) => {
  const userId = req.params.userId;

  const places = TEST_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (places.length === 0) {
    console.log(`No places found for user: ${userId}`);
    const error = new Error(
      'Could not find any places created by the provided user id.'
    );
    error.code = 404;
    return next(error);
  }

  res.json({ places });
});

export default router;
