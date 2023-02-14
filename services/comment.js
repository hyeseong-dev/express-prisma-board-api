import prisma from '../prisma/client.js';
import httpStatus from '../utils/httpStatus.js';

class CommentService {
  static prisma = prisma
  static model = 'comment'
  static async getAll(req,res,next) {
    try {
      const posts = await this.prisma.post.findMany({
        select: 
        {
          id: true,
          title: true,
          body: true,
          createdAt: true,
          updatedAt: true,
          comments: true,
          author: {
            select: {
              name: true
            }
          },
          category: {
            select: {
              name: true
            }
          }
        }
      });
      return res.json(posts);
    } catch (error) {
      next(error);
    }
  }

  static async create(req,  res, next) {
    console.log(req.params.postId, req.body.message);
    if (!req.params.postId|| !req.body.message){
      return res.status(httpStatus.BAD_REQUEST.code).json({message: httpStatus.BAD_REQUEST.message});
    }
    try {
    const comment = await this.prisma.comment.create({
      data:{
        message: req.body.message,
        userId: req.userId ,
        parentId: req.body.parentId,
        postId: req.params.postId 
      }
    })

      return res.status(httpStatus.CREATED.code).json(comment);
    } catch (error) {
      next(error);
    }
  }

  static async update(req,  res, next) {
    const commentId = req.params.commentId
    const userId = req.userId
    const message = req.body.message

    if (!commentId || !userId || !message){
      return res.status(httpStatus.BAD_REQUEST.code).json({message: httpStatus.BAD_REQUEST.message});
    }
    try {
      const comment = await this.prisma.comment.updateMany({
        where: {
          id:commentId,
          userId: userId,
        },
        data:{
          message:message
        }
      })
      if (!comment.count ){
        return res.status(httpStatus.NOT_FOUND.code).json({message: (httpStatus.NOT_FOUND.code)})
      }
      
      return res.status(httpStatus.OK.code).json({message: 'success to update message'});
    } catch (error) {
      next(error);
    }
  }

  static async get(req,  res, next) {
    const commentId = req.params.commentId;  
    if (!commentId) return res.status(httpStatus.BAD_REQUEST.code).json({message: httpStatus.BAD_REQUEST.message});
    try {
        const getCommentWithChildren = async (prisma, commentId, level = 0) => {
          const comment = await prisma.comment.findUniqueOrThrow({ where: { id: commentId }});
          const children = await prisma.comment.findMany({ where: { parentId: commentId }});
          if (!children.length) { comment.level; return comment; };
          comment.children = await Promise.all(children.map(child => getCommentWithChildren(prisma, child.id, level+1)));
          return comment;
      };
      const comment = await getCommentWithChildren(this.prisma, commentId);

      return res.status(httpStatus.OK.code).json(comment);
    } catch (error) {
      if (error.code === 'P2025') return res.status(httpStatus.NOT_FOUND.code).json({message: error.message})
      next(error);
      }
  }

  static async delete(req,  res, next) {
    const commentId = req.params.commentId;
    if (!commentId) return res.status(httpStatus.BAD_REQUEST.code).json({message: httpStatus.BAD_REQUEST.message});
    try {
      let comment = await this.prisma[this.model].findUnique({ where: { id:commentId } });
      if (!comment) return res.status(httpStatus.NOT_FOUND.code).send({ message: httpStatus.NOT_FOUND.message });
      if (comment.userId != req.userId) return res.status(httpStatus.FORBIDDEN.code).json({error: httpStatus.FORBIDDEN.message});
      await this.prisma[this.model].deleteMany({ where: { id:commentId } });
      return res.status(httpStatus.NO_CONTENT.code).send();
    } catch (error) {
      next(error);
    }
  }

}


export default CommentService;