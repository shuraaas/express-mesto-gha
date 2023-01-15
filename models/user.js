import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    findUserByCredentials({ email, password }) {
      return this.findOne({ email })
        .select('+password')
        .then((user) => {

          if (!user) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          // console.log(password, user.password)

          return bcrypt.compare(password, user.password)
            .then((matched) => {
              if (!matched) {
                return Promise.reject(new Error('Неправильные почта или пароль'));
              }

              return user;
              // return { message: 'Добро пожаловать!' };
            });
        })
        .catch((err) => console.log(err));
    },
  },
});

// userSchema.static.findUserByCredentials = function(email, password) {
//   return this.findOne({ email }).select('+password')
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new Error('Неправильные почта или пароль'));
//       }

//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             return Promise.reject(new Error('Неправильные почта или пароль'));
//           }

//           return user;
//         });
//     });
// };

const User = mongoose.model('user', userSchema);

export { User };
