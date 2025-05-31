const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(422).json({ error: "Category name is required" });
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        name,
      },
    });

    if (existingCategory) {
      return res.status(409).json({ error: "Category already exists" });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });

    return res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.getCategories = async (_, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      message: "Categories fetched successfully",
      categories,
      count: categories.length,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(422).json({ error: "Category ID is required" });
    }
    const { name } = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updateCategory = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: { name },
    });

    return res.status(200).json({
      message: "Category updated successfully",
      category: updateCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(422).json({ message: "Category ID is required" });
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const productCount = await prisma.product.count({
      where: {
        categoryId: parseInt(id),
      },
    });

    if (productCount) {
      return res
        .status(409)
        .json({
          message: `Category id being used in ${productCount} product(s)`,
        });
    }

    const deletedCategory = await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json({
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
