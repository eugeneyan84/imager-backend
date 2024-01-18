import { Router } from 'express';
import { check } from 'express-validator';

import {
  createPlace,
  deletePlace,
  getPlaceById,
  getPlacesByUserId,
  updatePlace,
} from '../controllers/places-controller.js';
import fileUpload from '../middleware/file-upload.js';

const router = Router();

router.get('/:placeId', getPlaceById);

router.get('/user/:userId', getPlacesByUserId);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 20 }),
    check('address').not().isEmpty(),
  ],
  createPlace
);

router.patch(
  '/:placeId',
  [check('title').not().isEmpty(), check('description').isLength({ min: 20 })],
  updatePlace
);

router.delete('/:placeId', deletePlace);

export default router;
