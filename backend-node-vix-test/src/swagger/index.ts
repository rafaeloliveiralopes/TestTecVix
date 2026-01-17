import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { Express } from "express";
import YAML from "yamljs";

const adjustReferences = (jsonData: string): { definitions: object } => {
  const jsonString = JSON.stringify(jsonData);
  const adjustedJsonString = jsonString.replace(
    /#\/definitions\//g,
    "#/components/schemas/",
  );
  return JSON.parse(adjustedJsonString);
};

const loadSchemas = () => {
  const filePath = path.resolve(__dirname, "schemas/json-schema.json");
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return adjustReferences(jsonData);
};

const schemas = loadSchemas()?.definitions || {};
const swaggerYamlPath = path.resolve(__dirname, "swagger.yaml");
const swaggerYamlDocs = YAML.load(swaggerYamlPath);
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Cloud",
      version: "1.0.0",
      description: "Docs API with Swagger and Prisma",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: "Local Server",
      },
    ],
    components: {
      schemas,
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = {
  ...swaggerJSDoc(swaggerOptions),
} as { paths: object; tags: Array<unknown>; components: object };
swaggerDocs.paths = swaggerYamlDocs.paths;
swaggerDocs.tags = swaggerYamlDocs.tags;

const baseComponents = (swaggerDocs.components || {}) as Record<
  string,
  unknown
>;
const yamlComponents = (swaggerYamlDocs?.components || {}) as Record<
  string,
  unknown
>;

swaggerDocs.components = {
  ...baseComponents,
  ...yamlComponents,
  schemas: {
    ...((baseComponents.schemas as Record<string, unknown>) || {}),
    ...((yamlComponents.schemas as Record<string, unknown>) || {}),
  },
  securitySchemes: {
    ...((baseComponents.securitySchemes as Record<string, unknown>) || {}),
    ...((yamlComponents.securitySchemes as Record<string, unknown>) || {}),
  },
};

export const setupSwagger = (app: Express): void => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
