import express from 'express';
import CommentService from '../services/comment.js';
import { authenticate } from '../utils/middleware.js';

const commentRouter = express.Router();

commentRouter.get('/:commentId', async (req, res, next) => {
    await CommentService.get(req, res, next);
});

commentRouter.put('/:commentId', authenticate, async (req, res, next) => {
    await CommentService.update(req, res, next);
});

commentRouter.post('', authenticate, async (req, res, next) => {
    await CommentService.create(req, res, next);
});


commentRouter.delete('/:commentId"', authenticate, async (req, res, next) => {
    await CommentService.delete(req, res, next);
});

export default commentRouter;