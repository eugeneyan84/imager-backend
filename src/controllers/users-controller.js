import { validationResult } from 'express-validator';

import User from '../models/user.js';
import HttpError from '../models/http-error.js';

export const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (error) {
    const err = new HttpError(
      'Error encountered during retrieving of users',
      500
    );
    return next(err);
  }

  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

export const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input(s) detected', 422));
  }

  const { name, email, password, imageUrl } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    const err = new HttpError(
      'Error encountered during user details verification',
      500
    );
    return next(err);
  }

  //const existingUser = TEST_USERS.find((u) => u.email === email);
  if (false) {
    const error = new HttpError(
      'Sign-up failed, there is existing user profile with same email.',
      422
    );
    return next(error);
  } else {
    console.log('Email verification is good!');
  }

  const newUser = new User({
    name,
    email,
    password,
    imageUrl,
    places: [],
  });

  try {
    const result = await newUser.save();
    console.log(result);
  } catch (error) {
    console.log(error.message);
    const err = new HttpError('Error encountered during sign up.', 422);
    return next(err);
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  let targetUser;
  try {
    targetUser = await User.findOne({ email });
  } catch (error) {
    const err = new HttpError('Error encountered during login.', 425002);
    return next(err);
  }

  if (!targetUser || targetUser.password !== password) {
    return next(new HttpError('Invalid email or password.', 401));
  }

  res.json({ message: 'Logged in!' });
};
