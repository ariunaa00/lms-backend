import { Request, Response, NextFunction } from "express";
import examService from "../services/examService";
import lessonService from "../services/lessonService";

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

export const getExamsOfLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lessonId = Number(req.params.lessonId);
        if (!lessonId) {
            return res.status(400).json({ message: `lesson id not found.` })
        }
        const list = await examService.getExamsByLesson(lessonId)
        return res.status(200).json(list)
    }
    catch (err) {
        next(err)

    }
}


export const saveResult = async (req: Request & { user: any }, res: Response, next: NextFunction) => {
    try {
        const examId = Number(req.params.examId);
        if (!examId) {
            return res.status(400).json({ message: `examId id not found.` })
        }
        const { correctAnswers, wrongAnswers, totalTime, totalAnswered } = req.body;

        const result = await examService.saveExamResult({
            correctPoint: correctAnswers.length,
            totalPoint: correctAnswers.length * 10,
            answeredQuestionNum: totalAnswered,
            totalTime
        }, examId, req.user.userId)

        return res.status(200).json(result)
    }
    catch (err) {
        next(err)

    }
}

export const getResult = async (req: Request & { user: any }, res: Response, next: NextFunction) => {
    try {

        const examId = Number(req.params.examId);
        if (!examId) {
            return res.status(400).json({ message: `examId id not found.` })
        }

        const list = await examService.getResult(req.user.userId, examId);
        return res.json(list)
    } catch (err) {
        next(err)
    }

}