import express from 'express';
import AuthService from '../services/auth.js'
import { authenticate } from '../utils/middleware.js';
const authRouter = express.Router();

authRouter.post('/refreshtoken', async(req, res, next) => {

})

authRouter.post('/login', async(req, res, next) => {
    await AuthService.login(req, res, next);
})

authRouter.get('/logout', authenticate, async(req, res, next) => {
    await AuthService.logout(req, res, next);
})

export default authRouter;