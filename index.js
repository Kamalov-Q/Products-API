const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
const { config } = require("dotenv");

config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT;

//Swagger docs setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const categoryRoute = require("./routes/category.route");
const productRoute = require("./routes/product.route");

app.use("/categories", categoryRoute);
app.use("/products", productRoute);

app.get("/health", async (req, res) => {
  try {
    // Basic query to check DB connectivity
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({ status: "ok", db: "connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ status: "error", db: "unreachable" });
  }
});

app.get("/", async (_, res) => {
  res.status(200).json("API is working fine");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
