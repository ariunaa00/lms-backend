import { Router } from "express";
import { getLessonList, saveLesson } from "../controllers/lessonController";
import multer from "multer";
import { getExamsOfLesson } from "../controllers/examController";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/", getLessonList);
router.post("/", upload.single('image'), saveLesson);
router.get("/:lessonId/exams", getExamsOfLesson)

export default router;  