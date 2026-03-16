import dotenv from "dotenv";
import multer from "multer";
dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });

interface Config {
  port: number;
  dbUri: string;
  jwtSecret: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  dbUri: process.env.DB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "default_secret",
};

export  {config, upload};