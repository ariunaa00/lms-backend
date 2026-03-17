import { Router } from "express";
import { getAllResult, getExamList, getExamsOfLesson, getResult, saveExam, saveResult } from "../controllers/examController";
import { getExam, getQuestionList, getQuestionsOfExam, saveQuestion } from "../controllers/questionController";
import { upload } from '../config'

const router = Router();

router.get("/", getExamList);
router.post("/", saveExam);
router.get('/:examId', getExam)

router.get("/:examId/questions", getQuestionsOfExam)
router.post('/:examId/question', upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
    { name: "video", maxCount: 1 },

  ]), saveQuestion)

router.post('/:examId/result', saveResult)
router.get('/:examId/result', getResult)
router.get('/allresult', getAllResult)



export default router;