import express from 'express';
import httpStatus from '../utils/httpStatus.js'


const likeRouter = express.Router();
const notFoundError = new NotFoundError()

likeRouter.get("/users", async(req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true}
    });
    res.json(users);
})

// Get a specific user by ID
likeRouter.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ 
    where: { id },
    select: {id: true, name: true, email: true, createdAt: true, updatedAt: true }
  });
  if (!user) {
    return res.status(notFoundError.code).json({ error: notFoundError.message });
  }
  res.json(user);
});

// Create a new user
likeRouter.post('/users', async (req, res) => {
    const { name, email, password } = req.body;
    
    let user = await prisma.user.findUnique({ 
        where: { email },
        select: {id: true, name: true, email: true, createdAt: true, updatedAt: true }
    });

    if (user) return res.status(httpStatus.OK.code).json({ message: 'email exist' });
    
    user = await prisma.user.create(
        { data: { name, email, password },
        select: {id: true, name: true, email: true, createdAt: true, updatedAt: true }
    });
    res.json(user);
});

// Update a user
likeRouter.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    
    let user = await prisma.user.findUnique({ 
    where: { id }
    });

    if (!user) return res.status(notFoundError.code).json({ error: notFoundError.message });
    const { name, email, password } = req.body;
    
    if (user) return res.status(httpStatus.OK.code).json({ message: 'email exist' });
    user = await prisma.user.create(
        { data: { name, email, password },
        select: {id: true, name: true, email: true, createdAt: true, updatedAt: true }
    });
    res.json(user);
});

export default likeRouter;