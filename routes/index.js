import express from 'express';
import userRouter from './user.js';
import authRouter from './auth.js';
import postRouter from './post.js';


const router = express.Router();

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/post', postRouter)

// router.all('/*', (req, res)=>{
//     res.json('Page Not Found');
// })

export default router;