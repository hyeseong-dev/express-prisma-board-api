import express from 'express';
import CategoryService from '../services/category.js'
import { authenticate } from '../utils/middleware.js';

const categoryRouter = express.Router();

categoryRouter.post('', authenticate, async (req, res, next) => {
    await CategoryService.create(req, res, next);
});

categoryRouter.get("/list", async(req, res, next) => {    
    await CategoryService.getAll(req, res, next);
})

categoryRouter.get('/:categoryName', async (req, res, next) => {
    await CategoryService.get(req, res, next);
});

categoryRouter.patch('/:categoryName', authenticate, async (req, res, next) => {
    await CategoryService.update(req, res, next);
});

categoryRouter.delete('/:categoryName', authenticate, async (req, res, next) => {
    await CategoryService.delete(req, res, next);
});

export default categoryRouter;