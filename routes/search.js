import express from 'express';
import SearchService from '../services/search.js'
import { authenticate } from '../utils/middleware.js';

const searchRouter = express.Router();

searchRouter.get('', async (req, res, next) => {
    await SearchService.get(req, res, next);
});

export default searchRouter;