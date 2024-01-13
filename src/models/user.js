import { model, Schema } from 'mongoose';
//import uniqueValidator from '@ladjs/mongoose-unique-validator';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      {
        validator: async function (email) {
          const user = await this.constructor.findOne({ email });
          if (user) {
            return false;
          }
          return true;
        },
        message: (props) => 'Email address is already in use.',
      },
      {
        validator: function (email) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
        },
        message: (props) => 'Email address is of invalid format',
      },
    ],
  },
  password: { type: String, required: true, minlength: 6 },
  imageUrl: { type: String, required: true },
  places: [{ type: Schema.Types.ObjectId, required: true, ref: 'Place' }],
});

//userSchema.plugin(uniqueValidator);

export default model('User', userSchema);
