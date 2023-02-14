import bcrypt from 'bcrypt';
import prisma from '../prisma/client.js';

const exclude = async(instance, keys) => {
  for (let key of keys) {
    delete instance[key]
  }
  return instance
}

const encrypt_password = async(password) => {
  const salt = bcrypt.genSaltSync(10);
  const result = bcrypt.hashSync(password, salt)
  return result
}

const matched_password = async(raw_password, encrypted_password) => {
  return bcrypt.compareSync(raw_password, encrypted_password)
}

class BaseService {
  static prisma = prisma

  static async paginate(model, or, req, res, options = {}) {
    const { page, limit } =req.query
    const currentPage = Math.max(parseInt(page) || 1, 1);
    const perPageLimit = parseInt(limit) || 10;
    const startIndex = (currentPage - 1) * perPageLimit;

    const totalPostCount = await this.prisma[model].count({ where: { ...or }});
    const totalPages = Math.ceil(totalPostCount / perPageLimit);
    const paginationResult = { totalPostCount, totalPages, currentPage };

    const setPaginationLinks = async (paginationResult) => {
      if (currentPage === 1) {
        paginationResult.next = { page: currentPage + 1, limit: perPageLimit };
      } else if (currentPage < totalPages) {
        paginationResult.previous = { page: currentPage - 1, limit: perPageLimit };
        paginationResult.next = { page: currentPage + 1, limit: perPageLimit };
      } else if (currentPage === totalPages) {
        paginationResult.last = { page: totalPages, limit: perPageLimit };
      } else {
        return res.status(httpStatus.NOT_FOUND.code).json({ error: "Resource not found" });
      }
    };

    const setPaginatedData = async (paginationResult) => {
      paginationResult.paginatedData = await this.prisma[model].findMany({
        where: {
          ...or
        },
        take: perPageLimit,
        skip: startIndex,
        orderBy: options.orderBy || [{ updatedAt: "desc" }],
      });
    };

    await setPaginationLinks(paginationResult);
    await setPaginatedData(paginationResult);

    paginationResult.currentCountPerPage = Object.keys(paginationResult.paginatedData).length;
    paginationResult.range = currentPage * perPageLimit;
    return res.json(paginationResult);
  }
}

export { exclude, encrypt_password, matched_password, BaseService};