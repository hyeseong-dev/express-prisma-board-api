import prisma from '../prisma/client.js';
import { exclude, encrypt_password, matched_password } from '../utils/service.js'
import jwt from 'jsonwebtoken';

class AuthService {
    static prisma = prisma;

    static async login({ body: { email, password } },  res, next) {
        try {
            res.clearCookie('accessToken')
            let user = await this.prisma.user.findUnique({
            where: { email },
            })
            if (!user) return res.status(404).json({message: 'incorrect email'});

            const is_matched_password = await matched_password(password, user.password)
            
            if(!is_matched_password) return res.status(401).json({message: 'unauthorized'});
            const accessToken = jwt.sign({userId: user.id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h', issuer: "Lee"});
            const refreshToken = jwt.sign({userId: user.id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '24h', issuer: "Lee"});
            exclude(user, ['password'])
            
            res.cookie("accessToken", accessToken, {
                secure: false, httpOnly: true,
            })
            res.cookie("refreshToken", refreshToken, {
                secure: false, httpOnly: true,
            })
            return res.status(200).json({user}) 
        } catch (error) {
            next(error);
        }
        }

    static async logout(req,res, next) {
        try {
            res.clearCookie('accessToken');
            res.status(204).send()
        } catch (error) {
            next(error);
        }
        }

    async update({ params: { id }, body: { email: updatedEmail, name: updatedName, password: updatedPassword }  }, res, next) {
        try {      
            let user = await this.prisma.user.findUnique({ where: { id } });
            
            if (!user) {
            return res.status(404).send({ message: 'User not found' });
            }
            const email = updatedEmail || user.email;
            const name = updatedName || user.name;
            const password = updatedPassword ? await encrypt_password(updatedPassword) : user.password;

            user = await this.prisma.user.update({
            where: { id },
            data: { email, name, password },
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
            });

            return res.status(200).json(user);
        } catch (error) {
            next(error);
        }
        }

    async delete({ params: { id } }, res, next) {
        try {
            let user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) return res.status(404).send({ message: 'User not found' });

            user = await this.prisma.user.delete({ where: { id } });
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
        }
        }

export default AuthService;