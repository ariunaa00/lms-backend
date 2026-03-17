import { Router } from "express";
import { getAllResult } from "../controllers/examController";


const router = Router();

router.get('/allresult', getAllResult)
export default router;
