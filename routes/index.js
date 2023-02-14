import express from 'express';
import userRouter from './user.js';
import authRouter from './auth.js';
import postRouter from './post.js';
import commentRouter from './comment.js';
import categoryRouter from './category.js';
import searchRouter from './search.js';


const router = express.Router();

router.use('/comment', commentRouter)
router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/post', postRouter)
router.use('/category', categoryRouter)
router.use('/search', searchRouter)

// router.all('/*', (req, res)=>{
//     res.json('Page Not Found');
// })

export default router;