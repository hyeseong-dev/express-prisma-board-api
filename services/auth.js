import prisma from '../prisma/client.js';
import { exclude, encrypt_password, matched_password } from '../utils/service.js'
import jwt from 'jsonwebtoken';
import httpStatus from '../utils/httpStatus.js'


class AuthService {
    static prisma = prisma;
    static async login({ body: { email, password } },  res, next) {
        try {

            res.clearCookie('accessToken')
            
            let user = await this.prisma.user.findUnique({
                where: { email },
            })
            
            if (!user) return res.status(httpStatus.BAD_REQUEST.code).json({error: httpStatus.BAD_REQUEST.message});
            
            const is_matched_password = await matched_password(password, user.password)
            
            if(!is_matched_password) return res.status(httpStatus.UNAUTHORIZED.code).json({error: httpStatus.UNAUTHORIZED.message});
            
            const accessToken = jwt.sign({userId: user.id}, 
                process.env.ACCESS_TOKEN_SECRET, 
                {expiresIn: '1h', issuer: "Lee"});

            const refreshToken = jwt.sign({userId: user.id}, 
                process.env.REFRESH_TOKEN_SECRET, 
                {expiresIn: '24h', issuer: "Lee"});

            delete user.password;
            
            res.cookie("accessToken", accessToken, {
                secure: false, httpOnly: true,
            })
            res.cookie("refreshToken", refreshToken, {
                secure: false, httpOnly: true,
            })
            return res.status(httpStatus.OK.code).json({user}) 
        } catch (error) {
            next(error);
        }
        }

    static async logout(req,res, next) {
        try {
            res.clearCookie('accessToken');
            res.status(httpStatus.NO_CONTENT.code).send()
        } catch (error) {
            next(error);
        }
        }

    async update({ params: { id }, body: { email: updatedEmail, name: updatedName, password: updatedPassword }  }, res, next) {
        try {      
            let user = await this.prisma.user.findUnique({ where: { id } });
            
            if (!user) {
            return res.status(httpStatus.NOT_FOUND.code).send({ error: httpStatus.NOT_FOUND.message });
            }
            const email = updatedEmail || user.email;
            const name = updatedName || user.name;
            const password = updatedPassword ? await encrypt_password(updatedPassword) : user.password;

            user = await this.prisma.user.update({
            where: { id },
            data: { email, name, password },
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
            });

            return res.status(httpStatus.OK.code).json(user);
        } catch (error) {
            next(error);
        }
        }

    async delete({ params: { id } }, res, next) {
        try {
            let user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) return res.status(httpStatus.NOT_FOUND.code).send({ message: httpStatus.NOT_FOUND.message });

            user = await this.prisma.user.delete({ where: { id } });
            return res.status(httpStatus.NO_CONTENT.code).send();
        } catch (error) {
            next(error);
        }
        }
        }

export default AuthService;