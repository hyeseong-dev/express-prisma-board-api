import prisma from '../prisma/client.js';
import {BaseService} from '../utils/service.js'


class SearchService extends BaseService{
  static model = "post"
  static async get(req,res,next) {
    try {
      const { category, title, body, page=1, limit=10 } = req.query;

      const or = (title || body) ? { 
        OR: [{ title: { contains: title, mode: 'insensitive' }},
            { body: { contains: body , mode: 'insensitive' }}],
      } : {};

      const options = { 
        orderBy: [{ updatedAt: "desc" },{ title: "asc" }]
      };

      const currentPage = parseInt(page);
      const perPageLimit = parseInt(limit);
      const startIndex = (currentPage - 1) * perPageLimit;

      const countQueryParamDB = {
        where: {
          category: { name: category},
          ...or
        }
      }
      const queryParamDB = {
        where: {
          category: { name: category},
          ...or
        },
        take: perPageLimit,
        skip: startIndex,
        orderBy: options.orderBy || [{ updatedAt: "desc" }],
      }

      const totalPostCount = await this.prisma[this.model].count(countQueryParamDB);
      const totalPages = Math.ceil(totalPostCount / perPageLimit)
      const setPaginationLinks = () => {
        if (currentPage === 1) {
          return { next: { page: currentPage + 1, limit: perPageLimit } };
        } else if (currentPage < totalPages) {
          return { 
            previous: { page: currentPage - 1, limit: perPageLimit },
            next: { page: currentPage + 1, limit: perPageLimit }
          };
        } else if (currentPage === totalPages) {
          return { last: { page: totalPages, limit: perPageLimit } };
        } else {
          throw new Error("Resource not found");
        }
      };

      const setPaginatedData = async () => {
        return await this.prisma[this.model].findMany(queryParamDB);
      };

      const [paginatedData, paginationLinks] = await Promise.all([setPaginatedData(), setPaginationLinks()]);

      const paginationResult = { 
        totalPostCount, 
        totalPages, 
        currentPage, 
        paginatedData, 
        currentCountPerPage: paginatedData.length,
        range: currentPage * perPageLimit,
        ...paginationLinks
      };

      return res.json(paginationResult);
    } catch (error) {
      next(error);
    }
  }
}



export default SearchService;