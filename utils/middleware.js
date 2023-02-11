import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';

export const authenticate = async (req, res , next) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken){
        res.status(401).send({message: 'unauthorized'})
        return
    }
    try {  
        const verified = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const user = await prisma.user.findUnique({where: { id:verified.userId}});
        req.userId = user.id;
        next();
    } catch (error) {
        res.clearCookie('accessToken');
        return res.status(401).json(error.message)
        // next(error);

    }
  
};