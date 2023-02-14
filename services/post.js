import prisma from '../prisma/client.js';
import {BaseService} from '../utils/service.js'


class PostService extends BaseService {
  static model = 'post'
  static async getAll(req,res,next) {
    try {
      const { category, title, body, page, limit} = req.query;

      const or = (title || body) ? { 
        OR: [{ title: { contains: title, mode: 'insensitive' }},
            { body: { contains: body , mode: 'insensitive' }}],
      } : {};

      const options = { 
        orderBy: [{ updatedAt: "desc" },{ title: "asc" }]
      };

      const currentPage = parseInt(page)| 1;
      const perPageLimit = parseInt(limit)| 10;
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

  static async create(req,res,next) {
    try {
      const authorId = req.userId
      const categoryName = req.body.categoryName
      const title = req.body.title
      const body = req.body.body
      
      const category = await this.prisma.category.findFirst({
        where: { name: categoryName },
        select: {id: true},
      })
      if (!category) return res.status(404).json({message: `${categoryName} not found`})
      const categoryId = category.id
      
      if (!authorId || !categoryId || !title || !body){
        return res.status(400).json({message : "Bad request"})
      } 

      const post = await this.prisma.post.create({
        data: { title, 
                body, 
                authorId,
                categoryId,
              },
      });
      return res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }

  static async get({params:{postId}},  res, next) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id:postId },
        select: {
          id:true,
          title: true,
          body: true,
          createdAt: true,
          updatedAt: true,
          author:{
            select: {              
              id: true,
              name: true,
            },
          },
          _count: {select: { comments: true},
        
        },
          // _count: {select: { likes: true}},
          comments: {
            orderBy: { createdAt: "desc"},
            select:{
              _count: { select: { likes: true}},
              id: true,
              message: true,
              parentId: true,
              createdAt: true,
              updatedAt: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
        }
      }
      );
      if (!post) return res.status(404).json({message: 'post not found'});
      
      return res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  static async update(req,  res, next) {
    try {
      const postId = req.params.postId
      const userId = req.userId
      const title = req.body.title
      const body = req.body.body
      
      if (!postId || !userId||!title || !body) return res.status(400).json({ message: 'bad request'})
        
      const _post = await this.prisma.post.updateMany({
        where: { id:postId, authorId: userId},
        data: {title, body}
      });
      if (!_post.count) return res.status(404).json({message: 'not found'});
      
      const post = await this.prisma.post.findUnique({
        where: { id:postId },
        select: {
          id:true,
          title: true,
          body: true,
          createdAt: true,
          updatedAt: true,
          author:{
            select: {              
              id: true,
              name: true,
            },
          },
          _count: {select: { comments: true},
        
        },
          comments: {
            orderBy: { createdAt: "desc"},
            select:{
              _count: { select: { likes: true}},
              id: true,
              message: true,
              parentId: true,
              createdAt: true,
              updatedAt: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
        }
      }
      );
      return res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req,  res, next) {
    try {
      const postId = req.params.postId
      const userId = req.userId
      if (!postId || !userId) return res.status(400).json({ message: 'bad request'})
      const post = await this.prisma.post.deleteMany({where: { id:postId, authorId: userId}});
      if (!post.count) return res.status(404).json({message: 'not found'});
      return res.status(200).json({message: "success to delete post"});

    } catch (error) {
      if (error.code === 'P2025'){
        return res.status(404).json({message: error.message})
      }
      next(error);
    }
  }


}

export default PostService;