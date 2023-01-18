import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UnAuthtorizedErr } from '../errors/index.js';

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
}, {
  versionKey: false,
  statics: {
    async findUserByCredentials({ email, password }) {
      const user = await this.findOne({ email }).select('+password');
      if (!user) {
        throw new UnAuthtorizedErr('Неправильные почта или пароль');
      }

      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        throw new UnAuthtorizedErr('Неправильные почта или пароль');
      }

      return user;
    },
  },
});

const User = mongoose.model('user', userSchema);

export { User };
