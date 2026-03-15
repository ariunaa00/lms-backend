import { Request, Response, NextFunction } from "express";
import examService from "../services/examService";

export const getExamList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await examService.getExamList();
        res.status(200).json(list)
    }
    catch (err) {
        next(err)
    }
}
export const saveExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exam = req.body();

        if (exam.id) {
            const _exam = await examService.updateExam(exam)
            return res.json(_exam)
        }

        const _exam = await examService.createExam(exam)
        return res.json(_exam)

    } catch (err) {
        next(err)
    }
}

export const getLessonExams = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    }
    catch (err) {
        next(err)

    }
}
