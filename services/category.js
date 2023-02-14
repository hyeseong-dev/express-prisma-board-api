import prisma from '../prisma/client.js';
import httpStatus from '../utils/httpStatus.js'


class CategoryService {
  static prisma = prisma
  static async getAll(req,res,next) {
    try {
      const posts = await this.prisma.category.findMany({
        select: 
        {
          name: true,
          _count: {select: { posts: true}},
        }
      });
      return res.json(posts);
    } catch (error) {
      next(error);
    }
  }

  static async create(req,res,next) {
    try {
      let name = req.body.name
      if(!name) return res.status(httpStatus.BAD_REQUEST.code).json({error: httpStatus.BAD_REQUEST.message})
      name = name.toLowerCase();
      let category = await this.prisma.category.findFirst({where: { name }});
      if (category) return res.status(httpStatus.OK.code).json({message: `${name} already exists`});
      category = await this.prisma.category.create({data:{name}}) 
      return res.status(httpStatus.CREATED.code).json(httpStatus.CREATED.message);
    } catch (error) {
      next(error);
    }
  }

  static async get({params:{categoryName}},  res, next) {
    try {
      if(!categoryName) return res.status(httpStatus.BAD_REQUEST.code).json({error: httpStatus.BAD_REQUEST.message})
      const name = categoryName.toLowerCase();
      let category = await this.prisma.category.findFirst({where: { name }});
      if (!category) return res.status(httpStatus.NOT_FOUND.code).json({error: httpStatus.NOT_FOUND.message});
      return res.status(httpStatus.OK.code).json(category);
    } catch (error) {
      next(error);
    }
  }

  static async update(req,  res, next) {
    try {
      let categoryName = req.params.categoryName
      let newCategoryName = req.body.name
      
      if(!categoryName || !newCategoryName) return res.status(httpStatus.BAD_REQUEST.code).json({error: httpStatus.BAD_REQUEST.message})
      categoryName = categoryName.toLowerCase();
      newCategoryName = newCategoryName.toLowerCase();

      const category = await this.prisma.category.findFirst({ where: { name: categoryName} });
      if (!category) return res.status(httpStatus.NOT_FOUND.code).json({error: httpStatus.NOT_FOUND.message});
      
      const newCategory = await this.prisma.category.findFirst({ where: { name: newCategoryName} });
      if (newCategory) return res.status(httpStatus.OK.code).json({message: `${newCategory.name} already exist`})
      
      const result = await this.prisma.category.update({ where: { id: category.id}, data: { name: newCategoryName }});
      
      return res.status(httpStatus.OK.code).json({message: 'success to update category name'});
    } catch (error) {
      next(error);
    }
  }

  static async delete(req,  res, next) {
    try {
      let name = req.params.categoryName
      if (!name) return res.status(httpStatus.BAD_REQUEST.code).json({error: httpStatus.BAD_REQUEST.message})
      name = name.toLowerCase()

      let category = await this.prisma.category.findFirst({ where: { name} });
      if (!category) return res.status(httpStatus.NOT_FOUND.code).json({error: httpStatus.NOT_FOUND.message});
      
      category = await this.prisma.category.delete({where: { id: category.id }});
      
      return res.status(httpStatus.OK.code).json({message: "success to delete category"});
    } catch (error) {
      if (error.code === 'P2025') return res.status(httpStatus.NOT_FOUND.code).json({error: httpStatus.NOT_FOUND.message});
      next(error);
    }
  }


}

export default CategoryService;