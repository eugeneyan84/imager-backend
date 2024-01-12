import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  imageUrl: { type: String, required: true },
  places: { type: String, required: true },
});

export default model('User', userSchema);
