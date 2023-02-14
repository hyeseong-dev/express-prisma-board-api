import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';
import httpStatus from './httpStatus.js';

export const authenticate = async (req, res , next) => {
    console.log(2);
    const accessToken = req.cookies.accessToken
    if (!accessToken){
        res.status(httpStatus.UNAUTHORIZED.code).send({message: 'unauthorized'})
        return
    }
    try {  
        const verified = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const user = await prisma.user.findUnique({where: { id:verified.userId}});
        req.userId = user.id;
        next();
    } catch (error) {
        res.clearCookie('accessToken');
        return res.status(httpStatus.UNAUTHORIZED.code).json(error.message)
        // next(error);

    }
  
};