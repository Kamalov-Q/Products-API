const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// Create a new category
exports.createProduct = async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;

    if (!name) {
      return res.status(422).json({ error: "Product name is required" });
    }

    if (!price || isNaN(price) || price <= 0) {
      return res.status(422).json({ error: "Valid product price is required" });
    }

    if (!categoryId) {
      return res.status(422).json({ error: "Category ID is required" });
    } else {
      if (
        !(await prisma.category.findUnique({
          where: {
            id: parseInt(categoryId),
          },
        }))
      ) {
        return res.status(404).json({ error: "Category does not exist" });
      }
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        name,
      },
    });

    if (existingProduct) {
      return res.status(409).json({ error: "Product already exists" });
    }

    const newProduct = await prisma.product.create({
      data: req.body,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        categoryId: true, // Exclude categoryId from the response
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Get all products
exports.getProducts = async (_, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        categoryId: true, // Exclude categoryId from the response
      },
    });

    res.status(200).json({
      message: "Products fetched successfully",
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               error: Product not found
 *       422:
 *         description: Product ID is required or invalid
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid product ID
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */

// Get a specific product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(422).json({ error: "Product id is required" });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        categoryId: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Update a specific product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;

    const { name, description, price, currency, quantity, active, categoryId } =
      req.body;

    if (price < 0 && quantity < 0) {
      return res
        .status(422)
        .json({ error: "Price and quantity cannot be negative" });
    }

    if (
      categoryId === undefined ||
      !(await prisma.category.findUnique({
        where: {
          id: parseInt(categoryId),
        },
      }))
    ) {
      return res.status(404).json({ error: "Category does not exist" });
    }

    if (!productId) {
      return res.status(422).json({ error: "Product id is required" });
    }

    if (!name || String(name).trim() === "") {
      return res.status(422).json({ error: "Product name is required" });
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: parseInt(productId),
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 🔍 Check for unique name conflict (exclude current product)
    const nameConflict = await prisma.product.findFirst({
      where: {
        name,
        NOT: {
          id: parseInt(productId),
        },
      },
    });

    if (nameConflict)
      return res.status(409).json({ message: "Product name already exists" });

    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (currency !== undefined) updateData.currency = currency;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (active !== undefined) updateData.active = active;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    const updatedProduct = await prisma.product.update({
      where: {
        id: parseInt(productId),
      },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        categoryId: true, // Exclude categoryId from the response
      },
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;

    if (!productId) {
      return res.status(422).json({ error: "Product id is required" });
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: parseInt(productId),
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const deletedProduct = await prisma.product.delete({
      where: {
        id: parseInt(productId),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        categoryId: true,
      },
    });

    return res.status(200).json({
      message: "Product successfully deleted",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProductByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (
      !categoryId ||
      String(categoryId).trim() === "" ||
      !(await prisma.category.findUnique({
        where: {
          id: parseInt(categoryId),
        },
      }))
    ) {
      return res
        .status(422)
        .json({ message: "Category id is required or not found" });
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: parseInt(categoryId),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: { categoryId: true },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      message: "Products fetched successfully by categoryId",
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
