import express from "express";
import helmet from "helmet";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import lessonRoutes from "./routes/lessonRoutes";
import examRoutes from "./routes/examRoutes";

import errorHandler from "./middlewares/errorHandler";
import { authMiddleware } from "./middlewares/auth";

const app = express();

app.use(express.json());    
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.use(helmet());
app.use(cors());

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", authMiddleware, userRoutes);
app.use("/api/v1/lesson", authMiddleware, lessonRoutes)
app.use("/api/v1/exam", authMiddleware, examRoutes)

app.use(errorHandler);

export default app;