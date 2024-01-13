import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';
import { startSession } from 'mongoose';

import { TEST_PLACES } from '../data/data.js';
import HttpError from '../models/http-error.js';
import { getCoordsForAddress } from '../util/location.js';
import Place from '../models/place.js';
import User from '../models/user.js';
import place from '../models/place.js';

export const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;

  let targetPlace;
  try {
    targetPlace = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError('Error encountered when retrieving place', 500);
    return next(err);
  }

  if (!targetPlace) {
    const err = new HttpError(
      'Cound not found a place for the provided id.',
      404
    );
    return next(err);
  }

  res.json({ place: targetPlace.toObject({ getters: true }) });
};

export const getPlacesByUserId_obsolete = async (req, res, next) => {
  const userId = req.params.userId;

  let targetPlaces;
  try {
    targetPlaces = await Place.find({ creator: userId });
  } catch (error) {
    const err = new HttpError(
      'Error encountered when retrieving place by userId',
      500
    );
    return next(err);
  }

  if (!targetPlaces) {
    const err = new HttpError(
      'Cound not find any place for the provided userId.',
      404
    );
    return next(err);
  }

  res.json(targetPlaces.map((p) => p.toObject({ getters: true })));
};

export const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  let targetedUser;
  try {
    targetedUser = await User.findById(userId).populate('places');
  } catch (error) {
    const err = new HttpError(
      'Error encountered when retrieving place by userId',
      500
    );
    return next(err);
  }

  if (!targetedUser) {
    const err = new HttpError(
      'Cound not find any place for the provided userId.',
      404
    );
    return next(err);
  } else {
    console.log(`User found! ${targetedUser.places.length}`);
    console.log(targetedUser.places);
  }

  res.json(targetedUser.places.map((p) => p.toObject({ getters: true })));
};

export const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    console.error(errors);
    next(new HttpError('Invalid input(s) detected', 422));
  }

  const { title, description, imageUrl, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  let targetedUser;
  try {
    targetedUser = await User.findById(creator);
  } catch (error) {
    return next(
      new HttpError('Error encountered when verifying user details', 500)
    );
  }

  if (!targetedUser) {
    return next(new HttpError('Create place failed, user not found.', 404));
  }

  const newPlace = new Place({
    title,
    description,
    imageUrl,
    location: coordinates,
    address,
    creator: targetedUser._id,
  });

  try {
    const session = await startSession();
    session.startTransaction();

    const result = await newPlace.save({ session });

    targetedUser.places.push(newPlace);
    const result2 = await targetedUser.save({ session });

    await session.commitTransaction();
  } catch (error) {
    const err = new HttpError('Error encountered when creating new place', 500);
    return next(err);
  }

  res.status(201).json({ place: newPlace });
};

export const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input(s) detected', 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.placeId;

  let targetPlace;
  try {
    targetPlace = await Place.findByIdAndUpdate(
      placeId,
      { title, description },
      { new: true, runValidators: true }
    );
  } catch (error) {
    console.error(error);
    const err = new HttpError(`Error encountered when updating place.`, 500);
    return next(err);
  }

  // targetPlace is undefined if findByIdAndUpdate is unable to locate document by id
  if (!targetPlace) {
    const err = new HttpError(
      `Update failed, no place found with provided placeId.`,
      404
    );
    return next(err);
  }

  res.status(200).json({ place: targetPlace.toObject({ getters: true }) });
};

export const deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;

  let targetedPlace;

  try {
    targetedPlace = await Place.findById(placeId).populate('creator');
  } catch (error) {
    const err = new HttpError(
      'Error encountered when attempting to retrieve place.',
      500
    );
    return next(err);
  }

  // targetPlace is undefined if findByIdAndDelete is unable to locate document by id
  if (!targetedPlace) {
    const err = new HttpError(
      `Deletion failed, no place found with provided placeId.`,
      404
    );
    return next(err);
  }

  try {
    const session = await startSession();
    session.startTransaction();

    const result = await targetedPlace.deleteOne({ session });
    targetedPlace.creator.places.pull(targetedPlace);
    const result1 = await targetedPlace.creator.save({ session });

    await session.commitTransaction();
  } catch (error) {
    console.error(error);
    const err = new HttpError(
      `Error encountered when attempting to delete place.`,
      404
    );
    return next(err);
  }

  res.status(200).json({
    message: 'Successfully deleted',
  });
};
