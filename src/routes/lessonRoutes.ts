import { Router } from "express";
import { getLessonList, saveLesson } from "../controllers/lessonController";
import { getExamList, getExamsOfLesson } from "../controllers/examController";
import { upload } from '../config'
const router = Router();

router.get("/", getLessonList);
router.post("/", upload.single('image'), saveLesson);
router.get("/:lessonId/exams", getExamsOfLesson)
router.get("/exams", getExamList)


export default router;  