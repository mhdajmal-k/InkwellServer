import cors from "cors";
import { config } from "./envConfig";

console.log(config.CORS_ORIGIN);
export const corsOptions: cors.CorsOptions = {
  origin: config.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
