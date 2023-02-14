import express from 'express';
import CommentService from '../services/comment.js';
import PostService from '../services/post.js'
import { authenticate } from '../utils/middleware.js';

const postRouter = express.Router();

postRouter.post('', authenticate, async (req, res, next) => {
    await PostService.create(req, res, next);
});

postRouter.get("/list", async(req, res, next) => {    
    await PostService.getAll(req, res, next);
})

postRouter.get('/:postId', async (req, res, next) => {
    await PostService.get(req, res, next);
});

postRouter.patch('/:postId', authenticate, async (req, res, next) => {
    await PostService.update(req, res, next);
});

postRouter.delete('/:postId', authenticate, async (req, res, next) => {
    await PostService.delete(req, res, next);
});

postRouter.post('/:postId/comment', authenticate, async (req, res, next) => {
    await CommentService.create(req, res, next);
});

postRouter.get('/:postId/comment/:commentId"', async (req, res, next) => {
    await CommentService.get(req, res, next);
});



postRouter.patch('/:postId/comment/:commentId"', authenticate, async (req, res, next) => {
    console.log(1);
    await CommentService.update(req, res, next);
});


postRouter.patch('/:postId/comment/:commentId"', authenticate, async (req, res, next) => {
    await CommentService.get(req, res, next);
});

// postRouter.post('', async (req, res, next) => {
//     await PostService.create(req, res, next);
// });
// postRouter.patch('', authenticate, async (req, res, next) => {
//     await PostService.update(req, res, next);
// });
// postRouter.delete('', authenticate, async (req, res, next) => {
//     await PostService.delete(req, res, next);
// });

export default postRouter;