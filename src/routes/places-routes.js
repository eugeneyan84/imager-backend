import express from 'express';
import {
  createPlace,
  deletePlace,
  getPlaceById,
  getPlacesByUserId,
  updatePlace,
} from '../controllers/places-controller.js';

const router = express.Router();

router.get('/:placeId', getPlaceById);

router.get('/user/:userId', getPlacesByUserId);

router.post('/', createPlace);

router.patch('/:placeId', updatePlace);

router.delete('/:placeId', deletePlace);

export default router;
