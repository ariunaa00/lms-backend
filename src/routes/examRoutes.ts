import { Router } from "express";
import { getExamList, saveExam } from "../controllers/examController";

const router = Router();

router.get("/", getExamList);
router.post("/", saveExam);



export default router;