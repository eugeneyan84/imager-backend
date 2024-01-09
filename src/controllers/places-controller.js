import { v4 as uuidv4 } from 'uuid';

import { TEST_PLACES } from '../data/data.js';
import HttpError from '../models/http-error.js';

export const getPlaceById = (req, res, next) => {
  const placeId = req.params.placeId;
  const place = TEST_PLACES.find((p) => {
    return p.id === Number(placeId);
  });

  if (!place) {
    throw new HttpError('Cound not found a place for the provided id.', 404);
  }

  res.json({ place });
};

export const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId;

  const places = TEST_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (places.length === 0) {
    return next(
      new HttpError(
        'Could not find any places created by the provided user id.',
        404
      )
    );
  }

  res.json({ places });
};

export const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;

  const newPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  TEST_PLACES.push(newPlace);

  res.status(201).json({ place: newPlace });
};
