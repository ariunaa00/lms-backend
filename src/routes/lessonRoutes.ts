import { Router } from "express";
import { getLessonList, saveLesson } from "../controllers/lessonController";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/", getLessonList);
router.post("/", upload.single('image'), saveLesson);

export default router;  