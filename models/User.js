import mongoose from 'mongoose';

//Mongodb schema of a user
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [20, 'Name must not exceed 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [9, 'Password must be at least 9 characters long'],
      validate: {
        validator: (value) => /(?=.*[A-Z])(?=.*\d)/.test(value),
        message: 'Password must contain at least one uppercase letter and one number',
      },
    },
    favouriteGenres:{
      type: [String],
      default: []
    },
    favoriteMovies: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
  },
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;