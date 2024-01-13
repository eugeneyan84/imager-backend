import { model, Schema, Types } from 'mongoose';
//import uniqueValidator from '@ladjs/mongoose-unique-validator';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true, minlength: 6 },
  imageUrl: { type: String, required: true },
  places: [{ type: Types.ObjectId, required: true }],
});

//userSchema.plugin(uniqueValidator);

export default model('User', userSchema);
