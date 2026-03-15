import { Router } from "express";
import { getExamList, getExamsOfLesson, saveExam } from "../controllers/examController";
import { getQuestionList, getQuestionsOfExam } from "../controllers/questionController";

const router = Router();

router.get("/", getExamList);
router.post("/", saveExam);
router.get("/:examId/questions", getQuestionsOfExam)


export default router;