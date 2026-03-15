import { Request, Response, NextFunction } from "express";
import questionService from "../services/questionService";

export const getQuestionList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { examId } = req.body;
        const list = await questionService.getQuestionList(examId);
        res.status(200).json(list)

    } catch (err) {
        next(err)
        res.status(500).json({ message: 'Алдаа гарлаа.' })
    }
}


export const getQuestionsOfExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const examId = Number(req.params.examId);
        const list = await questionService.getQuestionList(examId);
        res.status(200).json(list)

    } catch (err) {
        next(err)
        res.status(500).json({ message: 'Алдаа гарлаа.' })
    }
}



export const saveQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const questions = req.body;

        if (questions.length > 0) {
            if (questions[0].id) {
                let list = await await questionService.updateQuestions(questions)
                return res.json(list)
            }
            let list = await questionService.createQuestions(questions)
            return res.json(list)
        }

        return res.json([])

    } catch (err) {
        next(err)
        res.status(500).json({ message: 'Алдаа гарлаа.' })
    }
}