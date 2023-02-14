import prisma from '../prisma/client.js';

class CommentService {
  static prisma = prisma
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
    if (!req.params.postId|| !req.body.message){
      return res.status(400).json({message: 'Bad Request'});
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

      return res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }

  static async update(req,  res, next) {
    const commentId = req.params.commentId
    const userId = req.userId
    const message = req.body.message

    if (!commentId || !userId || !message){
      return res.status(400).json({message: 'Bad Request'});
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
        return res.status(404).json({message: 'not found'})
      }
      
      return res.status(200).json({message: 'success to update message'});
    } catch (error) {
      next(error);
    }
  }

  static async get(req,  res, next) {
    const commentId = req.params.commentId;  
    if (!commentId) return res.status(400).json({message: 'Bad Request'});
    try {
      const getCommentWithChildren = async (prisma, commentId, level = 0) => {
        const comment = await prisma.comment.findUniqueOrThrow({
          where: {
            id: commentId
          }
        });

        const children = await prisma.comment.findMany({
          where: {
            parentId: commentId
          }
        });

        if (!children.length) {
          comment.level  
          return comment
        };

        comment.children = await Promise.all(
          children.map(child => getCommentWithChildren(prisma, child.id, level+1))
        );

        return comment;
      };

      const comment = await getCommentWithChildren(this.prisma, commentId);


      return res.status(200).json(comment);
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({message: error.message})
      next(error);
      }
  }

}


export default CommentService;