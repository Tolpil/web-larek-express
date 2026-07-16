import mongoose from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: { token: string }[];
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: [2, 'Имя должно содержать минимум 2 символа'],
    maxlength: [30, 'Имя должно содержать максимум 30 символов'],
    default: 'Ё-мое',
  },
  email: {
    type: String,
    required: [true, 'Поле email обязательно'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Поле password обязательно'],
    minlength: [6, 'Пароль должен содержать минимум 6 символов'],
    select: false,
  },
  tokens: {
    type: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    select: false,
  },
});

export default mongoose.model<IUser>('user', userSchema);