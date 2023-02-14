import prisma from '../prisma/client.js';
import { exclude, encrypt_password, BaseService} from '../utils/service.js'
import httpStatus from '../utils/httpStatus.js'

class UserService extends BaseService{
  static prisma = prisma
  static model = 'user'
  static async getAll(req,res,next) {
    try {
      const { name, email, page, limit} = req.query
      const or = (name || email) ? { OR: [{ name: { contains: name, mode: 'insensitive' }},
                                         { email: { contains: email , mode: 'insensitive' }},
                                          ],
                                  } : {}

      const options = { orderBy: [{ updatedAt: "desc" },{ name: "asc" }]}
      const currentPage = Number(page) || 1;
      const perPageLimit = Number(limit) || 10;
      const startIndex = (currentPage - 1) * perPageLimit;
      
      // console.log(`${currentPage}, ${perPageLimit}, ${startIndex}`)
      const queryParamDB = { where: { ...or } }

      const countQueryParamDB = {
        where: { ...or },
        take: perPageLimit,
        skip: startIndex,
        orderBy: options.orderBy || [{ updatedAt: "desc" }],
      }

      const totalCount = await this.prisma[this.model].count(queryParamDB);
      const totalPages = Math.ceil(totalCount / perPageLimit);
      
      const setPaginationLinks = () => {
        if (currentPage === 1) {
          return { next: { page: currentPage + 1, limit: perPageLimit } };
        } else if (currentPage < totalPages) {
          return { previous: { page: currentPage - 1, limit: perPageLimit },
                   next: { page: currentPage + 1, limit: perPageLimit } };
        } else if (currentPage === totalPages) {
          return { last: { page: totalPages, limit: perPageLimit } };
        } else { 
          throw new NotFoundError();
        };
      };

      const setPaginatedData = async () => {
        return await this.prisma[this.model].findMany(countQueryParamDB);
      };

      const [paginatedData, paginationLinks] = await Promise.all([setPaginatedData(), setPaginationLinks()]);

      const paginationResult = { 
        totalCount, 
        totalPages, 
        currentPage, 
        paginatedData, 
        currentCountPerPage: paginatedData.length,
        range: currentPage * perPageLimit,
        ...paginationLinks
      };

      return res.json(paginationResult);
      // return res.json('paginationResult');
    } catch (error) {
      if (error instanceof NotFoundError) { return res.status(error.code).json({message: error.message})}
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
      if (!user) return res.status(httpStatus.NOT_FOUND.code).json({message: 'User not found'});
      
      exclude(user, ['password']);
      return res.status(httpStatus.OK.code).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async create({ body: { name, email, password } },res, next) {
    try {
      let user = await this.prisma[this.model].findUnique({ where: { email } });
      if (user) return res.status(httpStatus.OK.code).json({ message: 'email exist' });

      user = await this.prisma[this.model].create({
        data: { name, 
                email, 
                password: await encrypt_password(password) 
              },
        select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
      });

      return res.status(httpStatus.CREATED.code).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async update({ userId, body: { email: updatedEmail, name: updatedName, password: updatedPassword }  }, res, next) {
    try {      
      let user = await this.prisma[this.model].findUnique({ where: { id:userId } });
      
      if (!user) {
        return res.status(httpStatus.NOT_FOUND.code).send({ message: 'User not found' });
      }
      const email = updatedEmail || user.email;
      const name = updatedName || user.name;
      const password = updatedPassword ? await encrypt_password(updatedPassword) : user.password;

      user = await this.prisma[this.model].update({
        where: { id:userId},
        data: { email, name, password },
        select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
      });

      return res.status(httpStatus.OK.code).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async delete({userId}, res, next) {
    try {
      let user = await this.prisma[this.model].findUnique({ where: { id:userId } });
      if (!user) return res.status(httpStatus.NOT_FOUND.code).send({ message: 'User not found' });

      user = await this.prisma[this.model].delete({ where: { id:userId } });
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(httpStatus.NO_CONTENT.code).send();
    } catch (error) {
      next(error);
    }
  }
}

export default UserService;