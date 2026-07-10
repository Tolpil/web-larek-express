import { Router } from 'express';
import {
  login,
  register,
  getCurrentUser,
  logout,
  refreshAccessToken,
} from '../controllers/auth';
import auth from '../middlewares/auth';

const authRouter = Router();

authRouter.post('/auth/login', login);
authRouter.post('/auth/register', register);
authRouter.get('/auth/token', refreshAccessToken);
authRouter.get('/auth/logout', logout);
authRouter.get('/auth/user', auth, getCurrentUser);

export default authRouter;