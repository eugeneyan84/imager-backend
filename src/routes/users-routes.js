import express from 'express';
import { check } from 'express-validator';

import { getUsers, login, signup } from '../controllers/users-controller.js';
import fileUpload from '../middleware/file-upload.js';

const router = express.Router();

router.get('/', getUsers);

// single is one of the middlewares from fileUpload, to retrieve a single file of specified name
router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name').not().isEmpty(),
    //check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  signup
);

router.post('/login', login);

export default router;
