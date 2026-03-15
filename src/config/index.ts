import dotenv from "dotenv";
dotenv.config();

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

export default config;