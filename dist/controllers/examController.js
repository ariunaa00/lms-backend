"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResult = exports.saveResult = exports.getExamsOfLesson = exports.saveExam = exports.getAllResult = exports.getExamList = void 0;
const examService_1 = __importDefault(require("../services/examService"));
const getExamList = async (req, res, next) => {
    try {
        const list = await examService_1.default.getExamList();
        res.status(200).json(list);
    }
    catch (err) {
        next(err);
    }
};
exports.getExamList = getExamList;
const getAllResult = async (req, res, next) => {
    try {
        const list = await examService_1.default.getAllResult(req.user.userId);
        res.status(200).json(list);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllResult = getAllResult;
const saveExam = async (req, res, next) => {
    try {
        const exam = req.body();
        if (exam.id) {
            const _exam = await examService_1.default.updateExam(exam);
            return res.json(_exam);
        }
        const _exam = await examService_1.default.createExam(exam);
        return res.json(_exam);
    }
    catch (err) {
        next(err);
    }
};
exports.saveExam = saveExam;
const getExamsOfLesson = async (req, res, next) => {
    try {
        const lessonId = Number(req.params.lessonId);
        if (!lessonId) {
            return res.status(400).json({ message: `lesson id not found.` });
        }
        const list = await examService_1.default.getExamsByLesson(lessonId);
        return res.status(200).json(list);
    }
    catch (err) {
        next(err);
    }
};
exports.getExamsOfLesson = getExamsOfLesson;
const saveResult = async (req, res, next) => {
    try {
        const examId = Number(req.params.examId);
        if (!examId) {
            return res.status(400).json({ message: `examId id not found.` });
        }
        const { correctAnswers, wrongAnswers, totalTime, totalAnswered } = req.body;
        const result = await examService_1.default.saveExamResult({
            correctPoint: correctAnswers.length,
            totalPoint: correctAnswers.length * 10,
            answeredQuestionNum: totalAnswered,
            totalTime
        }, examId, req.user.userId);
        return res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.saveResult = saveResult;
const getResult = async (req, res, next) => {
    try {
        const examId = Number(req.params.examId);
        if (!examId) {
            return res.status(400).json({ message: `examId id not found.` });
        }
        const list = await examService_1.default.getResult(req.user.userId, examId);
        return res.json(list);
    }
    catch (err) {
        next(err);
    }
};
exports.getResult = getResult;
