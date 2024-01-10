import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';

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
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    console.error(errors);
    throw new HttpError('Invalid input(s) detected', 422);
  }

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

export const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.placeId;

  const targetPlace = { ...TEST_PLACES.find((p) => p.id === placeId) };
  const targetIndex = TEST_PLACES.findIndex((p) => p.id === placeId);

  targetPlace.title = title;
  targetPlace.description = description;

  TEST_PLACES[targetIndex] = targetPlace;

  res.status(200).json({ place: targetPlace });
};

export const deletePlace = (req, res, next) => {
  const placeId = req.params.placeId;
  const targetIndex = TEST_PLACES.findIndex((p) => p.id === placeId);
  if (targetIndex === -1) {
    return next(
      new HttpError(`Place (id: ${placeId}) not found for deletion.`, 404)
    );
  } else {
    TEST_PLACES.splice(targetIndex, 1);
    res.status(200).json({ message: 'Successfully deleted' });
  }
};
