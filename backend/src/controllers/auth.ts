import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import {
  JWT_SECRET,
  AUTH_ACCESS_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_EXPIRY,
} from '../config';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../errors';

interface TokenPayload {
  _id: string;
}

const generateTokens = (_id: string) => {
  const accessToken = jwt.sign({ _id }, JWT_SECRET, { expiresIn: AUTH_ACCESS_TOKEN_EXPIRY } as jwt.SignOptions);
  const refreshToken = jwt.sign({ _id }, JWT_SECRET, { expiresIn: AUTH_REFRESH_TOKEN_EXPIRY } as jwt.SignOptions);
  return { accessToken, refreshToken };
};

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней в миллисекундах
    path: '/',
  });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неправильные почта или пароль');
        }

        const { accessToken, refreshToken } = generateTokens(user._id.toString());

        user.tokens.push({ token: refreshToken });
        return user.save().then(() => {
          setRefreshTokenCookie(res, refreshToken);
          res.send({
            user: {
              email: user.email,
              name: user.name,
            },
            success: true,
            accessToken,
          });
        });
      });
    })
    .catch(next);
};

export const register = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      const { accessToken, refreshToken } = generateTokens(user._id.toString());

      user.tokens.push({ token: refreshToken });
      return user.save().then(() => {
        setRefreshTokenCookie(res, refreshToken);
        res.status(201).send({
          user: {
            email: user.email,
            name: user.name,
          },
          success: true,
          accessToken,
        });
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при регистрации'));
        return;
      }
      next(err);
    });
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    throw new UnauthorizedError('Невалидный токен');
  }

  User.findById(payload._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({
        user: {
          email: user.email,
          name: user.name,
        },
        success: true,
      });
    })
    .catch(next);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new BadRequestError('Невалидный _id');
  }

  let payload: TokenPayload;
  try {
    payload = jwt.verify(refreshToken, JWT_SECRET) as TokenPayload;
  } catch {
    throw new BadRequestError('Невалидный _id');
  }

  User.findById(payload._id).select('+tokens')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      user.tokens = user.tokens.filter((t) => t.token !== refreshToken);
      return user.save();
    })
    .then(() => {
      res.cookie('refreshToken', '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 0,
        path: '/',
      });
      res.send({ success: true });
    })
    .catch(next);
};

export const refreshAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new UnauthorizedError('Невалидный токен');
  }

  let payload: TokenPayload;
  try {
    payload = jwt.verify(refreshToken, JWT_SECRET) as TokenPayload;
  } catch {
    throw new UnauthorizedError('Невалидный токен');
  }

  User.findById(payload._id).select('+tokens')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Невалидный токен');
      }

      const tokenExists = user.tokens.some((t) => t.token === refreshToken);
      if (!tokenExists) {
        throw new UnauthorizedError('Невалидный токен');
      }

      const tokens = generateTokens(user._id.toString());

      user.tokens = user.tokens.filter((t) => t.token !== refreshToken);
      user.tokens.push({ token: tokens.refreshToken });
      return user.save().then(() => {
        setRefreshTokenCookie(res, tokens.refreshToken);
        res.send({
          user: {
            email: user.email,
            name: user.name,
          },
          success: true,
          accessToken: tokens.accessToken,
        });
      });
    })
    .catch(next);
};