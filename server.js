import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import createError from 'http-errors';

import router from './routes/index.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE'],
    credentials : true
}))
app.use(morgan('dev'));

app.get('/', async(req, res, next)=>{
    res.json({message: 'Hello, world!✅'})
})

app.use('/api', router);

app.use((req, res, next) => {
    next(createError.NotFound());
})
app.use((err, req, res, next) =>{
    res.status(err.status || 500);
    res.send({
        status: err.status || 500, 
        message: err.message,
    })
})

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:3000');
});