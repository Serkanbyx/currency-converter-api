const swaggerJsdoc = require("swagger-jsdoc");
const env = require("./env");
const { version } = require("../../package.json");

const servers = [
  {
    url: `http://localhost:${env.PORT}`,
    description: "Development server",
  },
];

if (env.PUBLIC_URL) {
  servers.unshift({
    url: env.PUBLIC_URL,
    description: "Production server",
  });
}

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Currency Converter API",
      version,
      description:
        "A RESTful API for real-time currency conversion with Redis caching. " +
        "Powered by ExchangeRate-API.",
      contact: {
        name: "Serkanby",
        url: "https://serkanbayraktar.com/",
      },
    },
    servers,
    tags: [
      { name: "Currency", description: "Currency conversion and rate endpoints" },
      { name: "Health", description: "Service health check" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
