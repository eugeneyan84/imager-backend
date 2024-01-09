import express from 'express';
import {
  createPlace,
  getPlaceById,
  getPlacesByUserId,
} from '../controllers/places-controller.js';

const router = express.Router();

router.get('/:placeId', getPlaceById);

router.get('/user/:userId', getPlacesByUserId);

router.post('/', createPlace);

export default router;
