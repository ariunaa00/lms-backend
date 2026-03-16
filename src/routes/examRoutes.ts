import { Router } from "express";
import { getExamList, getExamsOfLesson, saveExam } from "../controllers/examController";
import { getQuestionList, getQuestionsOfExam, saveQuestion } from "../controllers/questionController";
import { upload } from '../config'

const router = Router();

router.get("/", getExamList);
router.post("/", saveExam);
router.get("/:examId/questions", getQuestionsOfExam)
router.post('/:examId/question', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
    { name: "video", maxCount: 1 },

  ]), saveQuestion)

export default router;