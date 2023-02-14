import prisma from '../prisma/client.js';


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
      if(!name) return res.status(400).json({message: 'bad request'})
      name = name.toLowerCase();
      let category = await this.prisma.category.findFirst({where: { name }});
      if (category) return res.status(200).json({message: `${name} already exists`});
      category = await this.prisma.category.create({data:{name}}) 
      return res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  static async get({params:{categoryName}},  res, next) {
    try {
      if(!categoryName) return res.status(400).json({message: 'bad request'})
      const name = categoryName.toLowerCase();
      let category = await this.prisma.category.findFirst({where: { name }});
      if (!category) return res.status(404).json({message: `${name} not found`});
      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  static async update(req,  res, next) {
    try {
      let categoryName = req.params.categoryName
      let newCategoryName = req.body.name
      
      if(!categoryName || !newCategoryName) return res.status(400).json({message: 'bad request'})
      categoryName = categoryName.toLowerCase();
      newCategoryName = newCategoryName.toLowerCase();

      const category = await this.prisma.category.findFirst({ where: { name: categoryName} });
      if (!category) return res.status(404).json({message: `${categoryName} not found`})
      
      const newCategory = await this.prisma.category.findFirst({ where: { name: newCategoryName} });
      if (newCategory) return res.status(200).json({message: `${newCategory.name} already exist`})
      
      const result = await this.prisma.category.update({ where: { id: category.id}, data: { name: newCategoryName }});
      
      return res.status(200).json({message: 'success to update category name'});
    } catch (error) {
      next(error);
    }
  }

  static async delete(req,  res, next) {
    try {
      let name = req.params.categoryName
      if (!name) return res.status(400).json({ message: 'bad request'})
      name = name.toLowerCase()

      let category = await this.prisma.category.findFirst({ where: { name} });
      if (!category) return res.status(404).json({message: `${name} not found`})
      console.log(name,2, category);
      
      category = await this.prisma.category.delete({where: { id: category.id }});
      console.log(name,3);
      
      return res.status(200).json({message: "success to delete category"});
    } catch (error) {
      if (error.code === 'P2025'){
        return res.status(404).json({message: error.message})
      }
      next(error);
    }
  }


}

export default CategoryService;