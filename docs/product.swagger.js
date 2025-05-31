/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - categoryId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: The product description
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the product
 *         currency:
 *           type: string
 *           description: The currency code (e.g., USD)
 *         quantity:
 *           type: integer
 *           description: The available quantity
 *         active:
 *           type: boolean
 *           description: Product availability status
 *         categoryId:
 *           type: integer
 *           description: The ID of the associated category
 *         category:
 *           $ref: '#/components/schemas/Category'
 *       example:
 *         id: 1
 *         name: "Smartphone"
 *         description: "Latest model smartphone"
 *         price: 699.99
 *         currency: "USD"
 *         quantity: 50
 *         active: true
 *         categoryId: 2
 *         category:
 *           id: 2
 *           name: "Electronics"
 *
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *       example:
 *         id: 2
 *         name: "Electronics"
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       409:
 *         description: Product already exists
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *       409:
 *         description: Product name already exists
 *         content:
 *           application/json:
 *             example:
 *               error: Product name already exists
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               error: Validation error
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product successfully deleted
 *         content:
 *           application/json:
 *             example:
 *               message: Product deleted successfully
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               error: Product not found
 *       422:
 *         description: Invalid product ID
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
