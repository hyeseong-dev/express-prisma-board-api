import prisma from '../prisma/client.js';
import { exclude, encrypt_password, BaseService} from '../utils/service.js'

class UserService extends BaseService{
  static prisma = prisma
  static model = 'user'
  static async getAll(req,res,next) {
    try {
      const { category, name, email, page, limit } = req.query
      const or = (name || email) ? { category: { name: category },
                                      OR: [{ name: { contains: name, mode: 'insensitive' }},
                                            { email: { contains: email , mode: 'insensitive' }},
                                          ],
                                  } : {}
      const options = { orderBy: [{ updatedAt: "desc" },{ title: "asc" }]}
      const result = await this.paginate(this.model, or, page, limit, options);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async get(req,  res, next) {
    try {
      const user = await this.prisma[this.model].findUnique({
        where: { id:req.userId },
        include: {
          comments: true,
          likes: true,
          posts: true,
        },
      });
      if (!user) return res.status(404).json({message: 'User not found'});
      
      exclude(user, ['password']);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async create({ body: { name, email, password } },res, next) {
    try {
      let user = await this.prisma[this.model].findUnique({ where: { email } });
      if (user) return res.status(200).json({ message: 'email exist' });

      user = await this.prisma[this.model].create({
        data: { name, 
                email, 
                password: await encrypt_password(password) 
              },
        select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
      });

      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async update({ userId, body: { email: updatedEmail, name: updatedName, password: updatedPassword }  }, res, next) {
    try {      
      let user = await this.prisma[this.model].findUnique({ where: { id:userId } });
      
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      const email = updatedEmail || user.email;
      const name = updatedName || user.name;
      const password = updatedPassword ? await encrypt_password(updatedPassword) : user.password;

      user = await this.prisma[this.model].update({
        where: { id:userId},
        data: { email, name, password },
        select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
      });

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async delete({userId}, res, next) {
    try {
      let user = await this.prisma[this.model].findUnique({ where: { id:userId } });
      if (!user) return res.status(404).send({ message: 'User not found' });

      user = await this.prisma[this.model].delete({ where: { id:userId } });
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default UserService;