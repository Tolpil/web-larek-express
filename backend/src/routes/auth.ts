import { Router } from 'express';
import {
  login,
  register,
  getCurrentUser,
  logout,
  refreshAccessToken,
} from '../controllers/auth';
import auth from '../middlewares/auth';
import {
  validateLogin,
  validateRegister,
  validateRefreshToken,
  validateLogout,
} from '../middlewares/validation';

const authRouter = Router();

authRouter.post('/auth/login', validateLogin, login);
authRouter.post('/auth/register', validateRegister, register);
authRouter.get('/auth/token', validateRefreshToken, refreshAccessToken);
authRouter.get('/auth/logout', validateLogout, logout);
authRouter.get('/auth/user', auth, getCurrentUser);

export default authRouter;