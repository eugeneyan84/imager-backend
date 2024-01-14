import axios from 'axios';
import dotenv from 'dotenv';
import HttpError from '../models/http-error.js';

dotenv.config({ path: './.env' });

export const getCoordsForAddress = async (address) => {
  //console.log(`address: ${address}, api-key: ${process.env.GOOGLE_API_KEY}`);
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.GOOGLE_API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'Could not find location for specified address',
      422
    );
    throw error;
  } else {
    console.log(data);
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
};
