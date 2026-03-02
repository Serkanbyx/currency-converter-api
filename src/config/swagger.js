const swaggerJsdoc = require("swagger-jsdoc");
const env = require("./env");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Currency Converter API",
      version: "1.0.0",
      description:
        "A RESTful API for real-time currency conversion with Redis caching. " +
        "Powered by ExchangeRate-API.",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development server",
      },
    ],
    tags: [
      { name: "Currency", description: "Currency conversion and rate endpoints" },
      { name: "Health", description: "Service health check" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
