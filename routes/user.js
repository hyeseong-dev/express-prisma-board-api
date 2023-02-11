import express from 'express';
import { authenticate } from '../utils/middleware.js';
import UserService from '../services/user.js'

const userRouter = express.Router();

userRouter.get("/list", authenticate, async(req, res, next) => {    
    await UserService.getAll(req, res, next);
})

userRouter.get('', authenticate, async (req, res, next) => {
    await UserService.get(req, res, next);
});
userRouter.post('', async (req, res, next) => {
    await UserService.create(req, res, next);
});
userRouter.patch('', authenticate, async (req, res, next) => {
    await UserService.update(req, res, next);
});
userRouter.delete('', authenticate, async (req, res, next) => {
    await UserService.delete(req, res, next);
});

export default userRouter;