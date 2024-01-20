import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import HttpError from '../models/http-error.js';
import { generateToken } from '../util/token.js';

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

  const { name, email, password } = req.body;

  if (false) {
    const error = new HttpError(
      'Sign-up failed, there is existing user profile with same email.',
      422
    );
    return next(error);
  } else {
    console.log('Email verification is good!');
  }

  let hashPwd;
  try {
    hashPwd = await bcrypt.hash(password, 12);
  } catch (error) {
    const err = new HttpError(
      'Error encountered when creating user, please try again',
      500
    );
    return next(err);
  }

  const newUser = new User({
    name,
    email,
    password: hashPwd,
    imageUrl: `${req.file.path}`,
    places: [],
  });

  try {
    const result = await newUser.save();
    console.log(result);
  } catch (error) {
    let message;
    if (error.errors && Object.keys(error.errors).length > 0) {
      message = error.errors[Object.keys(error.errors)[0]].message;
    } else {
      message = 'Error encountered during sign up.';
    }
    const err = new HttpError(message, 422);
    return next(err);
  }

  let token;
  let expiryTimestamp;
  try {
    const tokenRecord = generateToken(newUser.id, newUser.email);
    token = tokenRecord.token;
    expiryTimestamp = tokenRecord.expiryTimestamp;
    /*     token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.BACKEND_P_KEY,
      { expiresIn: '1h' }
    ); */
  } catch (error) {
    const err = new HttpError(
      'Error encountered when creating user, please try again',
      500
    );
    return next(err);
  }

  const userObj = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    imageUrl: newUser.imageUrl,
    token,
    expiryTimestamp,
  };

  //console.log(userObj);
  res.status(201).json({
    user: userObj,
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  let targetUser;
  try {
    targetUser = await User.findOne({ email });
  } catch (error) {
    const err = new HttpError('Error encountered during login.', 500);
    return next(err);
  }

  if (!targetUser) {
    return next(new HttpError('Invalid email or password.', 403));
  }

  let isValidPwd = false;
  try {
    isValidPwd = await bcrypt.compare(password, targetUser.password);
  } catch (error) {
    const err = new HttpError('Error encountered during login.', 500);
    return next(err);
  }

  if (!isValidPwd) {
    return next(
      new HttpError('Invalid credentials, could not log you in.', 403)
    );
  }

  let token;
  let expiryTimestamp;
  try {
    const tokenRecord = generateToken(targetUser.id, targetUser.email);
    token = tokenRecord.token;
    expiryTimestamp = tokenRecord.expiryTimestamp;
    /*     token = jwt.sign(
      { userId: targetUser.id, email: targetUser.email },
      process.env.BACKEND_P_KEY,
      { expiresIn: '1h' }
    ); */
  } catch (error) {
    console.error(error);
    const err = new HttpError(
      'Error encountered during login, please try again',
      500
    );
    return next(err);
  }

  //const profile = { ...targetUser.toObject({ getters: true }) };
  //delete profile.password;

  const userObj = {
    id: targetUser.id,
    name: targetUser.name,
    email: targetUser.email,
    imageUrl: targetUser.imageUrl,
    token,
    expiryTimestamp,
  };
  //console.log(userObj);
  res.json({
    user: userObj,
  });
};
