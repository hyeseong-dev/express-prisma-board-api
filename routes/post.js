import express from 'express';
import PostService from '../services/post.js'

const postRouter = express.Router();

postRouter.get("/list", async(req, res, next) => {    
    await PostService.getAll(req, res, next);
})

// postRouter.get('', authenticate, async (req, res, next) => {
//     await PostService.get(req, res, next);
// });
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