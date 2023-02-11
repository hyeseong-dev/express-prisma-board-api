import express from 'express';

const likeRouter = express.Router();


// likeRouter.post('/signup', )
// likeRouter.post('/login', )
// likeRouter.post('/accesstoken', )
// likeRouter.post('/refreshtoken', )
// likeRouter.post('/logout', )
// Get all users
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
    return res.status(404).json({ error: 'User not found' });
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

    if (user) return res.status(200).json({ message: 'email exist' });
    
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

    if (!user) return res.status(404).json({ message: 'user not exist' });

    const { name, email, password } = req.body;
    
    if (user) return res.status(200).json({ message: 'email exist' });
    
    user = await prisma.user.create(
        { data: { name, email, password },
        select: {id: true, name: true, email: true, createdAt: true, updatedAt: true }
    });
    res.json(user);
});

export default likeRouter;