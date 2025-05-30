const swaggerJsDocs = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Category API",
      version: "1.0.0",
      description: "API documentation for Category CRUD using Prisma",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Server",
      },
    ],
  },
  apis: ["./controllers/*.js"], // Path to files with JSDoc comments
};

const swaggerSpec = swaggerJsDocs(options);
module.exports = swaggerSpec;
